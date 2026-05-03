import type { StoryParams } from "@/domain/story";
import { StoryGenerationError } from "@/domain/story-generation";
import {
  buildGeminiStoryPrompt,
  GEMINI_TEMPLATE_PROMPT_VERSION,
  parseGeminiStoryMarkdown,
  parseStoryParams
} from "@/services/story-generation/server/gemini-story";

const baseParams: StoryParams = {
  childName: "Luna",
  childAge: 6,
  theme: "animals",
  storyType: "bedtime",
  duration: "short",
  specialDetail: "medo do escuro"
};

describe("Gemini story template helpers", () => {
  it("builds a prompt from template placeholders", () => {
    const prompt = buildGeminiStoryPrompt(
      [
        "Criança: [Nome da Criança]",
        "Idade: [Idade]",
        "Tema: [Tema Selecionado: Aventura, Animais, Espaço, Princesa/Príncipe, Dinossauros, Fantasia e Magia ou Natureza]",
        "Tipo: [Estilo: Divertida, Educativa, Para Dormir ou Com Lição de Moral]",
        "Duração: [Curta, Média ou Longa]",
        "Detalhe: [Contexto adicional fornecido pelo usuário]",
        "Adapte vocabulário para [Idade] anos."
      ].join("\n"),
      baseParams
    );

    expect(prompt).toContain("Criança: Luna");
    expect(prompt).toContain("Idade: 6");
    expect(prompt).toContain("Tema: Animais");
    expect(prompt).toContain("Tipo: Para Dormir");
    expect(prompt).toContain("Duração: Curta");
    expect(prompt).toContain("Detalhe: medo do escuro");
    expect(prompt).toContain("Adapte vocabulário para 6 anos.");
  });

  it("parses Gemini markdown into normalized story output", () => {
    const story = parseGeminiStoryMarkdown(
      [
        "---",
        "## Título: A Noite de Luna",
        "",
        "**[ACOLHEDOR]** Luna encontrou uma estrela tranquila.",
        "",
        "**[SONOLENTO]** Então respirou devagar e dormiu em paz.",
        "---"
      ].join("\n"),
      baseParams
    );

    expect(story).toEqual({
      title: "A Noite de Luna",
      text: [
        "**[ACOLHEDOR]** Luna encontrou uma estrela tranquila.",
        "",
        "**[SONOLENTO]** Então respirou devagar e dormiu em paz."
      ].join("\n"),
      estimatedMinutes: 3,
      promptVersion: GEMINI_TEMPLATE_PROMPT_VERSION
    });
  });

  it("parses common Gemini title format variations", () => {
    const variants = [
      [
        "```markdown",
        "**Titulo:** A Coragem de Luna",
        "",
        "**[ACOLHEDOR]** Luna respirou com calma.",
        "```"
      ].join("\n"),
      [
        "# Título da História - A Coragem de Luna",
        "",
        "**[ACOLHEDOR]** Luna respirou com calma."
      ].join("\n"),
      [
        "A Coragem de Luna",
        "",
        "**[ACOLHEDOR]** Luna respirou com calma."
      ].join("\n")
    ];

    for (const variant of variants) {
      const story = parseGeminiStoryMarkdown(variant, baseParams);

      expect(story.title).toBe("A Coragem de Luna");
      expect(story.text).toBe("**[ACOLHEDOR]** Luna respirou com calma.");
    }
  });

  it("rejects invalid params and malformed markdown", () => {
    expect(() => parseStoryParams({ ...baseParams, childAge: 13 })).toThrow(StoryGenerationError);
    expect(() => parseGeminiStoryMarkdown("**[ACOLHEDOR]** Sem título.", baseParams)).toThrow(StoryGenerationError);
    expect(() => parseGeminiStoryMarkdown("## Título: Vazio", baseParams)).toThrow(StoryGenerationError);
  });
});
