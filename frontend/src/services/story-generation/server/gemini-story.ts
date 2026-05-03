import { readFile } from "node:fs/promises";
import path from "node:path";
import type { StoryDuration, StoryParams, StoryTheme, StoryType } from "@/domain/story";
import { StoryGenerationError } from "@/domain/story-generation";

export const GEMINI_TEMPLATE_PROMPT_VERSION = "tts-template-v1.0.0";

type ParsedStoryMarkdown = {
  title: string;
  text: string;
  estimatedMinutes: number;
  promptVersion: string;
};

const themeLabels: Record<StoryTheme, string> = {
  adventure: "Aventura",
  animals: "Animais",
  space: "Espaço",
  princess_prince: "Princesa/Príncipe",
  dinosaurs: "Dinossauros",
  fantasy_magic: "Fantasia e Magia",
  nature: "Natureza"
};

const storyTypeLabels: Record<StoryType, string> = {
  funny: "Divertida",
  educational: "Educativa",
  bedtime: "Para Dormir",
  moral_lesson: "Com Lição de Moral"
};

const durationLabels: Record<StoryDuration, string> = {
  short: "Curta",
  medium: "Média",
  long: "Longa"
};

const durationMinutes: Record<StoryDuration, number> = {
  short: 3,
  medium: 7,
  long: 12
};

const allowedThemes = new Set(Object.keys(themeLabels));
const allowedStoryTypes = new Set(Object.keys(storyTypeLabels));
const allowedDurations = new Set(Object.keys(durationLabels));

function replaceAll(source: string, search: string, replacement: string) {
  return source.split(search).join(replacement);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseStoryParams(input: unknown): StoryParams {
  if (!isPlainObject(input)) {
    throw new StoryGenerationError("invalid_input");
  }

  const childName = typeof input.childName === "string" ? input.childName.trim() : "";
  const childAge = typeof input.childAge === "number" ? input.childAge : Number.NaN;
  const theme = input.theme;
  const storyType = input.storyType;
  const duration = input.duration;
  const specialDetail = typeof input.specialDetail === "string" ? input.specialDetail.trim() : "";

  if (!childName || !Number.isInteger(childAge) || childAge < 1 || childAge > 12) {
    throw new StoryGenerationError("invalid_input");
  }

  if (
    typeof theme !== "string" ||
    typeof storyType !== "string" ||
    typeof duration !== "string" ||
    !allowedThemes.has(theme) ||
    !allowedStoryTypes.has(storyType) ||
    !allowedDurations.has(duration)
  ) {
    throw new StoryGenerationError("invalid_input");
  }

  return {
    childName,
    childAge,
    theme: theme as StoryTheme,
    storyType: storyType as StoryType,
    duration: duration as StoryDuration,
    ...(specialDetail ? { specialDetail } : {})
  };
}

export async function readStoryTemplate() {
  const templatePath = path.join(process.cwd(), "assets", "template.tts.md");
  return readFile(templatePath, "utf8");
}

export function buildGeminiStoryPrompt(template: string, params: StoryParams) {
  const detail = params.specialDetail || "Nenhum detalhe especial informado.";
  let prompt = template;

  prompt = replaceAll(prompt, "[Nome da Criança]", params.childName);
  prompt = replaceAll(prompt, "[Idade]", String(params.childAge));
  prompt = replaceAll(
    prompt,
    "[Tema Selecionado: Aventura, Animais, Espaço, Princesa/Príncipe, Dinossauros, Fantasia e Magia ou Natureza]",
    themeLabels[params.theme]
  );
  prompt = replaceAll(
    prompt,
    "[Estilo: Divertida, Educativa, Para Dormir ou Com Lição de Moral]",
    storyTypeLabels[params.storyType]
  );
  prompt = replaceAll(prompt, "[Curta, Média ou Longa]", durationLabels[params.duration]);
  prompt = replaceAll(prompt, "[Contexto adicional fornecido pelo usuário]", detail);

  return prompt;
}

function stripMarkdownFences(markdown: string) {
  return markdown
    .trim()
    .replace(/^```(?:markdown|md|text)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function stripOuterDelimiters(markdown: string) {
  return markdown
    .split("\n")
    .filter((line) => !/^-{3,}$/.test(line.trim()))
    .join("\n")
    .trim();
}

function estimateMinutesFromMarkdown(text: string, duration: StoryDuration) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 80) {
    return durationMinutes[duration];
  }
  return Math.max(1, Math.round(words / 130));
}

function normalizeTitle(title: string) {
  return title
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, "")
    .replace(/^\*+|\*+$/g, "")
    .trim();
}

function extractTitleAndText(markdown: string) {
  const lines = markdown.split("\n");
  const titleLineIndex = lines.findIndex((line) =>
    /^\s*(?:#{1,6}\s*)?(?:\*\*)?t[ií]tulo(?:\s+da\s+hist[oó]ria)?\s*(?:\*\*)?\s*[:\-–—]\s*(.+)$/i.test(line)
  );

  if (titleLineIndex >= 0) {
    const titleMatch = lines[titleLineIndex].match(
      /^\s*(?:#{1,6}\s*)?(?:\*\*)?t[ií]tulo(?:\s+da\s+hist[oó]ria)?\s*(?:\*\*)?\s*[:\-–—]\s*(.+)$/i
    );
    const title = normalizeTitle(titleMatch?.[1] ?? "");
    const text = lines
      .filter((_, index) => index !== titleLineIndex)
      .join("\n")
      .trim();

    return { title, text };
  }

  const firstContentLineIndex = lines.findIndex((line) => line.trim());
  if (firstContentLineIndex < 0) {
    return { title: "", text: "" };
  }

  const firstContentLine = lines[firstContentLineIndex].trim();
  const nextText = lines
    .slice(firstContentLineIndex + 1)
    .join("\n")
    .trim();

  if (!/^\*?\*?\[[A-Z_]+]\*?\*?/.test(firstContentLine) && /^\s*(?:#{1,6}\s*)?(.+?)\s*$/.test(firstContentLine) && nextText) {
    return {
      title: normalizeTitle(firstContentLine.replace(/^\s*#{1,6}\s*/, "")),
      text: nextText
    };
  }

  return { title: "", text: markdown.trim() };
}

export function parseGeminiStoryMarkdown(rawMarkdown: string, params: StoryParams): ParsedStoryMarkdown {
  const normalized = stripOuterDelimiters(stripMarkdownFences(rawMarkdown));

  if (!normalized) {
    throw new StoryGenerationError("empty_output");
  }

  const { title, text } = extractTitleAndText(normalized);

  if (!title) {
    throw new StoryGenerationError("provider_malformed");
  }

  if (!text) {
    throw new StoryGenerationError("refused_output");
  }

  return {
    title,
    text,
    estimatedMinutes: estimateMinutesFromMarkdown(text, params.duration),
    promptVersion: GEMINI_TEMPLATE_PROMPT_VERSION
  };
}
