import { buildStoryPrompt } from "@/services/story-generation/prompt-builder";
import type { StoryParams } from "@/domain/story";

const baseParams: StoryParams = {
  childName: "Luna",
  childAge: 6,
  theme: "animals",
  storyType: "bedtime",
  duration: "short",
  specialDetail: "medo do escuro"
};

describe("buildStoryPrompt", () => {
  it("includes mandatory safety and Portuguese output rules", () => {
    const prompt = buildStoryPrompt(baseParams);
    expect(prompt.system).toContain("segurança infantil");
    expect(prompt.system).toContain("sem violência gráfica");
    expect(prompt.system).toContain("Responda somente em JSON válido.");
  });

  it("adapts bedtime pacing and no-cliffhanger guidance", () => {
    const prompt = buildStoryPrompt(baseParams);
    expect(prompt.user).toContain("ritmo calmo");
    expect(prompt.user).toContain("sem cliffhanger");
  });

  it("includes educational and moral lesson action guidance", () => {
    const educational = buildStoryPrompt({ ...baseParams, storyType: "educational" });
    const moral = buildStoryPrompt({ ...baseParams, storyType: "moral_lesson" });
    expect(educational.user).toContain("por meio de ações");
    expect(moral.user).toContain("pelas escolhas e consequências");
  });

  it("includes special detail instruction when provided", () => {
    const prompt = buildStoryPrompt(baseParams);
    expect(prompt.user).toContain("Detalhe especial obrigatório");
    expect(prompt.user).toContain("medo do escuro");
  });

  it("adapts age band instruction", () => {
    const younger = buildStoryPrompt({ ...baseParams, childAge: 3 });
    const older = buildStoryPrompt({ ...baseParams, childAge: 10 });
    expect(younger.user).toContain("faixa 1-4");
    expect(older.user).toContain("faixa 9-12");
  });
});

