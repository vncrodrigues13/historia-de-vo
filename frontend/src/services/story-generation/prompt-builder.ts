import type { StoryParams, StoryTheme, StoryType } from "@/domain/story";

export const PROMPT_VERSION = "story-v1.0.0";

type StoryPrompt = {
  promptVersion: string;
  system: string;
  user: string;
};

const durationGuidance: Record<StoryParams["duration"], { minutes: number; words: string }> = {
  short: { minutes: 3, words: "280 a 420 palavras" },
  medium: { minutes: 7, words: "560 a 860 palavras" },
  long: { minutes: 12, words: "980 a 1400 palavras" }
};

const themeGuidance: Record<StoryTheme, string> = {
  adventure: "inclua descoberta, coragem e progresso gradual da jornada",
  animals: "personagens animais com comportamentos carinhosos e linguagem simples",
  space: "curiosidade sobre estrelas e planetas com tom acolhedor",
  princess_prince: "reino gentil sem violência e com resolução cooperativa",
  dinosaurs: "dinossauros amigáveis e curiosos com foco em amizade",
  fantasy_magic: "magia leve, protetiva e positiva, sem sustos intensos",
  nature: "paisagens naturais tranquilas com cuidado e respeito ao ambiente"
};

const storyTypeGuidance: Record<StoryType, string> = {
  funny: "inclua humor leve e apropriado para criança",
  educational: "ensine algo concreto por meio de ações dos personagens, sem tom de aula",
  bedtime: "ritmo calmo, frases suaves, sem cliffhanger e final acolhedor para dormir",
  moral_lesson: "mostre a lição moral pelas escolhas e consequências dos personagens"
};

function getAgeBandInstruction(age: number): string {
  if (age <= 4) {
    return "faixa 1-4: vocabulário muito simples, frases curtas, conflito mínimo e reconforto frequente";
  }

  if (age <= 8) {
    return "faixa 5-8: vocabulário simples a intermediário, aventura leve e explicações objetivas";
  }

  return "faixa 9-12: vocabulário intermediário, desafio moderado e resolução clara";
}

export function buildStoryPrompt(params: StoryParams): StoryPrompt {
  const duration = durationGuidance[params.duration];
  const safetyRules = [
    "sem violência gráfica, terror, gore, abuso, humilhação ou conteúdo sexual",
    "sem linguagem ofensiva, preconceito, discriminação ou incentivo a risco",
    "sem cliffhanger angustiante no final",
    "concluir com sensação de segurança, afeto e esperança"
  ];

  const detailInstruction = params.specialDetail
    ? `Detalhe especial obrigatório: integrar de forma natural "${params.specialDetail}" na história.`
    : "Sem detalhe especial obrigatório.";

  return {
    promptVersion: PROMPT_VERSION,
    system: [
      "Você escreve histórias infantis em português do Brasil.",
      "Siga regras de segurança infantil em toda resposta.",
      `Regras obrigatórias: ${safetyRules.join("; ")}.`,
      "Responda somente em JSON válido."
    ].join(" "),
    user: [
      `Crie uma história para ${params.childName}, ${params.childAge} anos.`,
      `Tema: ${params.theme} (${themeGuidance[params.theme]}).`,
      `Tipo: ${params.storyType} (${storyTypeGuidance[params.storyType]}).`,
      `Duração alvo: ~${duration.minutes} minutos (${duration.words}).`,
      `Adaptação por idade: ${getAgeBandInstruction(params.childAge)}.`,
      detailInstruction,
      'Formato JSON obrigatório: {"title":"...","text":"...","estimatedMinutes":numero}.',
      "O texto deve mencionar o nome da criança e ser coerente do início ao fim."
    ].join(" ")
  };
}

