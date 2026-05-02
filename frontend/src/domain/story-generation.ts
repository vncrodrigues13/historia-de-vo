import type { StoryParams } from "@/domain/story";

export type GenerateStoryRequest = {
  params: StoryParams;
};

export type GeneratedStory = {
  id: string;
  title: string;
  text: string;
  estimatedMinutes: number;
  promptVersion: string;
  sourceParams: StoryParams;
  createdAt: string;
  generatedAt: string;
};

export type StoryGenerationErrorCode =
  | "invalid_input"
  | "provider_unavailable"
  | "provider_malformed"
  | "empty_output"
  | "refused_output"
  | "in_flight"
  | "unknown";

export class StoryGenerationError extends Error {
  readonly code: StoryGenerationErrorCode;

  constructor(code: StoryGenerationErrorCode, message?: string) {
    super(message ?? code);
    this.name = "StoryGenerationError";
    this.code = code;
  }
}
