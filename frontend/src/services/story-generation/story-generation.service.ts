import type { StoryParams } from "@/domain/story";
import {
  StoryGenerationError,
  type GenerateStoryRequest,
  type GeneratedStory
} from "@/domain/story-generation";
import { buildStoryPrompt } from "@/services/story-generation/prompt-builder";
import {
  HttpStoryProviderAdapter,
  type StoryProviderAdapter
} from "@/services/story-generation/provider";

type RawGeneratedPayload = {
  title?: string;
  text?: string;
  estimatedMinutes?: number;
  promptVersion?: string;
};

function createGeneratedStoryId() {
  return `generated_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isValidStoryParams(params: StoryParams) {
  return Boolean(params.childName.trim()) && Number.isInteger(params.childAge) && params.childAge >= 1 && params.childAge <= 12;
}

function estimateMinutesFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 130));
}

function parseProviderPayload(raw: string): RawGeneratedPayload {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("invalid");
    }
    return parsed as RawGeneratedPayload;
  } catch {
    throw new StoryGenerationError("provider_malformed");
  }
}

function normalizeStoryOutput(payload: RawGeneratedPayload, request: GenerateStoryRequest, promptVersion: string): GeneratedStory {
  if (typeof payload.text !== "string") {
    throw new StoryGenerationError("empty_output");
  }

  const text = payload.text.trim();
  if (!text) {
    throw new StoryGenerationError("refused_output");
  }

  const title = payload.title?.trim() || `Uma história para ${request.params.childName}`;
  const estimatedMinutes =
    typeof payload.estimatedMinutes === "number" && payload.estimatedMinutes > 0
      ? Math.round(payload.estimatedMinutes)
      : estimateMinutesFromText(text);

  const createdAt = new Date().toISOString();
  return {
    id: createGeneratedStoryId(),
    title,
    text,
      estimatedMinutes,
    promptVersion: payload.promptVersion?.trim() || promptVersion,
    sourceParams: request.params,
    createdAt,
    generatedAt: createdAt
  };
}

export class StoryGenerationService {
  private readonly provider: StoryProviderAdapter;
  private inFlight = false;

  constructor(provider: StoryProviderAdapter = new HttpStoryProviderAdapter()) {
    this.provider = provider;
  }

  async generate(request: GenerateStoryRequest): Promise<GeneratedStory> {
    if (this.inFlight) {
      throw new StoryGenerationError("in_flight");
    }

    if (!isValidStoryParams(request.params)) {
      throw new StoryGenerationError("invalid_input");
    }

    this.inFlight = true;
    try {
      const prompt = buildStoryPrompt(request.params);
      const response = await this.provider.generate({
        params: request.params,
        prompt: { system: prompt.system, user: prompt.user }
      });
      const payload = parseProviderPayload(response.rawText);
      return normalizeStoryOutput(payload, request, prompt.promptVersion);
    } catch (error) {
      if (error instanceof StoryGenerationError) {
        throw error;
      }

      throw new StoryGenerationError("provider_unavailable");
    } finally {
      this.inFlight = false;
    }
  }
}

export function toStoryGenerationUserMessage(error: unknown) {
  if (!(error instanceof StoryGenerationError)) {
    return "Não foi possível gerar a história agora. Tente novamente em instantes.";
  }

  switch (error.code) {
    case "invalid_input":
      return "Os dados informados são inválidos. Revise os campos e tente novamente.";
    case "refused_output":
      return "Não conseguimos gerar uma história válida desta vez. Ajuste os detalhes e tente novamente.";
    case "empty_output":
      return "A resposta veio vazia. Tente gerar novamente com os mesmos dados.";
    case "provider_malformed":
      return "Recebemos uma resposta inválida. Tente gerar novamente.";
    case "in_flight":
      return "Já estamos gerando sua história. Aguarde a conclusão.";
    case "provider_unavailable":
    case "unknown":
    default:
      return "Serviço temporariamente indisponível. Tente novamente em alguns segundos.";
  }
}
