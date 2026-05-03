import type { StoryParams } from "@/domain/story";
import { StoryGenerationError } from "@/domain/story-generation";
import type { StoryGenerationErrorCode } from "@/domain/story-generation";

export type StoryProviderInput = {
  params: StoryParams;
  prompt: { system: string; user: string };
};

export type StoryProviderOutput = {
  rawText: string;
};

export interface StoryProviderAdapter {
  generate(input: StoryProviderInput): Promise<StoryProviderOutput>;
}

type GenerateStoryApiResponse = {
  title?: string;
  text?: string;
  estimatedMinutes?: number;
  promptVersion?: string;
};

type GenerateStoryApiError = {
  error?: {
    code?: StoryGenerationErrorCode;
  };
};

function isStoryGenerationErrorCode(code: unknown): code is StoryGenerationErrorCode {
  return (
    code === "invalid_input" ||
    code === "provider_unavailable" ||
    code === "provider_malformed" ||
    code === "empty_output" ||
    code === "refused_output" ||
    code === "in_flight" ||
    code === "unknown"
  );
}

async function readJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resolveThemeLabel(theme: StoryParams["theme"]): string {
  const labels: Record<StoryParams["theme"], string> = {
    adventure: "aventura",
    animals: "animais",
    space: "espaço",
    princess_prince: "reino encantado",
    dinosaurs: "dinossauros",
    fantasy_magic: "fantasia e magia",
    nature: "natureza"
  };

  return labels[theme];
}

function resolveTypeLabel(storyType: StoryParams["storyType"]): string {
  const labels: Record<StoryParams["storyType"], string> = {
    funny: "divertida",
    educational: "educativa",
    bedtime: "para dormir",
    moral_lesson: "com lição de moral"
  };

  return labels[storyType];
}

function getDefaultMinutes(duration: StoryParams["duration"]) {
  const values: Record<StoryParams["duration"], number> = {
    short: 3,
    medium: 7,
    long: 12
  };
  return values[duration];
}

export class LocalStoryProviderAdapter implements StoryProviderAdapter {
  async generate(input: StoryProviderInput): Promise<StoryProviderOutput> {
    const { params } = input;
    const detail = params.specialDetail ? ` e lembrou de ${params.specialDetail}` : "";
    const title = `A Noite de ${params.childName} em ${resolveThemeLabel(params.theme)}`;
    const text =
      `${params.childName} partiu para uma história ${resolveTypeLabel(params.storyType)} com passos tranquilos${detail}. ` +
      `No caminho, descobriu que pequenas escolhas gentis mudavam o dia de todos ao redor. ` +
      `No fim, ${params.childName} voltou para casa com o coração calmo, respirou fundo e adormeceu em segurança.`;

    return Promise.resolve({
      rawText: JSON.stringify({
        title,
        text,
        estimatedMinutes: getDefaultMinutes(params.duration)
      })
    });
  }
}

export class HttpStoryProviderAdapter implements StoryProviderAdapter {
  constructor(private readonly endpoint = "/api/stories/generate") {}

  async generate(input: StoryProviderInput): Promise<StoryProviderOutput> {
    let response: Response;

    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input.params)
      });
    } catch {
      throw new StoryGenerationError("provider_unavailable");
    }

    const payload = await readJsonResponse(response);

    if (!response.ok) {
      const apiError = payload as GenerateStoryApiError | null;
      const code = apiError?.error?.code;
      throw new StoryGenerationError(isStoryGenerationErrorCode(code) ? code : "provider_unavailable");
    }

    const storyPayload = payload as GenerateStoryApiResponse;
    return {
      rawText: JSON.stringify({
        title: storyPayload.title,
        text: storyPayload.text,
        estimatedMinutes: storyPayload.estimatedMinutes,
        promptVersion: storyPayload.promptVersion
      })
    };
  }
}

export function isRetryableProviderErrorCode(code: StoryGenerationErrorCode) {
  return code === "provider_unavailable" || code === "provider_malformed" || code === "unknown";
}
