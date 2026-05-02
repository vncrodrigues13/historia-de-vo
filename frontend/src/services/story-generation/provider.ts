import type { StoryParams } from "@/domain/story";
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

export function isRetryableProviderErrorCode(code: StoryGenerationErrorCode) {
  return code === "provider_unavailable" || code === "provider_malformed" || code === "unknown";
}

