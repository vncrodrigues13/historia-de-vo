import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import pino from "pino";
import { StoryGenerationError, type StoryGenerationErrorCode } from "@/domain/story-generation";
import {
  buildGeminiStoryPrompt,
  parseGeminiStoryMarkdown,
  parseStoryParams,
  readStoryTemplate
} from "@/services/story-generation/server/gemini-story";

export const runtime = "nodejs";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const logger = pino({
  name: "stories-generate",
  level: process.env.LOG_LEVEL ?? "info"
});

type ErrorResponse = {
  error: {
    code: StoryGenerationErrorCode;
  };
};

type GeminiRequestConfig = {
  temperature: number;
  responseMimeType: "text/plain";
};

type GeminiConfigValidation = {
  apiKey: string;
  apiKeyDiagnostics: {
    present: boolean;
    length: number;
    masked: string | null;
    hasLeadingOrTrailingWhitespace: boolean;
    containsWhitespace: boolean;
    hasLikelyAiStudioPrefix: boolean;
    warnings: string[];
    errors: string[];
  };
  model: string;
  modelDiagnostics: {
    source: "GEMINI_MODEL" | "default";
    containsWhitespace: boolean;
    errors: string[];
  };
  valid: boolean;
};

function errorResponse(code: StoryGenerationErrorCode, status: number) {
  return NextResponse.json<ErrorResponse>({ error: { code } }, { status });
}

function createRequestId() {
  return `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function maskApiKey(apiKey: string) {
  if (!apiKey) {
    return null;
  }

  if (apiKey.length <= 8) {
    return `${apiKey.slice(0, 2)}...`;
  }

  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}

function validateGeminiConfig(): GeminiConfigValidation {
  const rawApiKey = process.env.GEMINI_API_KEY ?? "";
  const apiKey = rawApiKey.trim();
  const apiKeyWarnings: string[] = [];
  const apiKeyErrors: string[] = [];
  const hasLeadingOrTrailingWhitespace = rawApiKey !== apiKey;
  const containsWhitespace = /\s/.test(apiKey);
  const looksLikePlaceholder = /^(change[_-]?me|dummy|example|placeholder|replace[_-]?me|test|your[_-]?key)$/i.test(apiKey);
  const hasLikelyAiStudioPrefix = apiKey.startsWith("AIza");

  if (!apiKey) {
    apiKeyErrors.push("GEMINI_API_KEY is missing or empty.");
  }

  if (apiKey && apiKey.length < 20) {
    apiKeyErrors.push("GEMINI_API_KEY is shorter than expected.");
  }

  if (containsWhitespace) {
    apiKeyErrors.push("GEMINI_API_KEY contains whitespace.");
  }

  if (looksLikePlaceholder) {
    apiKeyErrors.push("GEMINI_API_KEY appears to be a placeholder.");
  }

  if (hasLeadingOrTrailingWhitespace) {
    apiKeyWarnings.push("GEMINI_API_KEY has leading or trailing whitespace; the trimmed value will be used.");
  }

  if (apiKey && !hasLikelyAiStudioPrefix) {
    apiKeyWarnings.push("GEMINI_API_KEY does not start with the common AI Studio prefix 'AIza'.");
  }

  const rawModel = process.env.GEMINI_MODEL?.trim();
  const model = rawModel || DEFAULT_GEMINI_MODEL;
  const modelErrors: string[] = [];
  const modelContainsWhitespace = /\s/.test(model);

  if (!model) {
    modelErrors.push("Gemini model is empty.");
  }

  if (modelContainsWhitespace) {
    modelErrors.push("Gemini model contains whitespace.");
  }

  return {
    apiKey,
    apiKeyDiagnostics: {
      present: Boolean(apiKey),
      length: apiKey.length,
      masked: maskApiKey(apiKey),
      hasLeadingOrTrailingWhitespace,
      containsWhitespace,
      hasLikelyAiStudioPrefix,
      warnings: apiKeyWarnings,
      errors: apiKeyErrors
    },
    model,
    modelDiagnostics: {
      source: rawModel ? "GEMINI_MODEL" : "default",
      containsWhitespace: modelContainsWhitespace,
      errors: modelErrors
    },
    valid: apiKeyErrors.length === 0 && modelErrors.length === 0
  };
}

function logInfo(requestId: string, message: string, details?: Record<string, unknown>) {
  logger.info({ ...(details ?? {}), requestId }, message);
}

function logError(requestId: string, message: string, details?: Record<string, unknown>) {
  logger.error({ ...(details ?? {}), requestId }, message);
}

function describeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof StoryGenerationError ? { code: error.code } : {})
    };
  }

  return { value: error };
}

function summarizeGeminiResponse(response: unknown) {
  if (!response || typeof response !== "object") {
    return response;
  }

  const responseRecord = response as Record<string, unknown>;
  return {
    text: typeof responseRecord.text === "string" ? responseRecord.text : undefined,
    candidates: responseRecord.candidates,
    promptFeedback: responseRecord.promptFeedback,
    usageMetadata: responseRecord.usageMetadata
  };
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  let params;

  let geminiRawText: string | null = null;

  try {
    const body = await request.json();
    logInfo(requestId, "received story generation request body", { body });
    params = parseStoryParams(body);
    logInfo(requestId, "validated story generation params", { params });
  } catch (error) {
    logError(requestId, "invalid story generation request", { error: describeError(error) });
    return errorResponse("invalid_input", 400);
  }

  const geminiConfig = validateGeminiConfig();
  logInfo(requestId, "validated Gemini configuration", {
    apiKey: geminiConfig.apiKeyDiagnostics,
    model: geminiConfig.model,
    modelDiagnostics: geminiConfig.modelDiagnostics,
    valid: geminiConfig.valid
  });

  if (!geminiConfig.valid) {
    logError(requestId, "Gemini configuration is invalid", {
      apiKey: geminiConfig.apiKeyDiagnostics,
      model: geminiConfig.model,
      modelDiagnostics: geminiConfig.modelDiagnostics
    });
    return errorResponse("provider_unavailable", 503);
  }

  try {
    const template = await readStoryTemplate();
    const prompt = buildGeminiStoryPrompt(template, params);
    const apiConfig: GeminiRequestConfig = {
      temperature: 0.85,
      responseMimeType: "text/plain"
    };

    logInfo(requestId, "calling Gemini generateContent", {
      model: geminiConfig.model,
      apiInput: {
        model: geminiConfig.model,
        contents: prompt,
        config: apiConfig
      },
      promptCharacterCount: prompt.length
    });

    const startedAt = Date.now();
    const ai = new GoogleGenAI({ apiKey: geminiConfig.apiKey });
    const response = await ai.models.generateContent({
      model: geminiConfig.model,
      contents: prompt,
      config: apiConfig
    });
    const durationMs = Date.now() - startedAt;

    logInfo(requestId, "received Gemini generateContent response", {
      durationMs,
      apiOutput: summarizeGeminiResponse(response)
    });

    geminiRawText = response.text?.trim() ?? "";
    if (!geminiRawText) {
      logError(requestId, "Gemini returned empty text", {
        apiOutput: summarizeGeminiResponse(response)
      });
      return errorResponse("empty_output", 502);
    }

    logInfo(requestId, "received Gemini raw story text before parsing", {
      rawText: geminiRawText,
      rawTextCharacterCount: geminiRawText.length
    });

    const parsedStory = parseGeminiStoryMarkdown(geminiRawText, params);
    logInfo(requestId, "parsed Gemini story output", {
      parsedStory,
      storyTextCharacterCount: parsedStory.text.length
    });

    return NextResponse.json(parsedStory);
  } catch (error) {
    if (error instanceof StoryGenerationError) {
      const status = error.code === "provider_malformed" || error.code === "empty_output" ? 502 : 400;
      logError(requestId, "story generation output validation failed", {
        status,
        error: describeError(error),
        geminiRawText,
        geminiRawTextCharacterCount: geminiRawText?.length ?? 0
      });
      return errorResponse(error.code, status);
    }

    logError(requestId, "Gemini provider call failed", {
      error: describeError(error)
    });
    return errorResponse("provider_unavailable", 503);
  }
}
