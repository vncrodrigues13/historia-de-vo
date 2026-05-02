import { StoryGenerationError } from "@/domain/story-generation";
import {
  StoryGenerationService
} from "@/services/story-generation/story-generation.service";
import type { StoryProviderAdapter } from "@/services/story-generation/provider";
import type { StoryParams } from "@/domain/story";

const baseParams: StoryParams = {
  childName: "Luna",
  childAge: 6,
  theme: "animals",
  storyType: "bedtime",
  duration: "short"
};

describe("StoryGenerationService", () => {
  it("returns typed normalized story from valid provider output", async () => {
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => ({
        rawText: JSON.stringify({
          title: "Noite da Luna",
          text: "Luna encontrou uma trilha calma e voltou feliz para casa.",
          estimatedMinutes: 3
        })
      }))
    };
    const service = new StoryGenerationService(provider);
    const story = await service.generate({ params: baseParams });
    expect(story.title).toBe("Noite da Luna");
    expect(story.text).toContain("Luna");
    expect(story.promptVersion).toBeTruthy();
    expect(story.sourceParams.childName).toBe("Luna");
    expect(story.id).toMatch(/^generated_/);
    expect(story.createdAt).toBeTruthy();
  });

  it("maps malformed provider output to typed error", async () => {
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => ({ rawText: "not-json" }))
    };
    const service = new StoryGenerationService(provider);
    await expect(service.generate({ params: baseParams })).rejects.toMatchObject<StoryGenerationError>({
      code: "provider_malformed"
    });
  });

  it("rejects empty story text as refused output", async () => {
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => ({ rawText: JSON.stringify({ title: "X", text: "" }) }))
    };
    const service = new StoryGenerationService(provider);
    await expect(service.generate({ params: baseParams })).rejects.toMatchObject<StoryGenerationError>({
      code: "refused_output"
    });
  });

  it("maps missing story text to empty output", async () => {
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => ({ rawText: JSON.stringify({ title: "X" }) }))
    };
    const service = new StoryGenerationService(provider);
    await expect(service.generate({ params: baseParams })).rejects.toMatchObject<StoryGenerationError>({
      code: "empty_output"
    });
  });

  it("prevents duplicate in-flight generation requests", async () => {
    let release = () => {};
    const provider: StoryProviderAdapter = {
      generate: jest.fn(
        () =>
          new Promise((resolve) => {
            release = () =>
              resolve({
                rawText: JSON.stringify({ title: "A", text: "B", estimatedMinutes: 1 })
              });
          })
      )
    };

    const service = new StoryGenerationService(provider);
    const first = service.generate({ params: baseParams });
    const second = service.generate({ params: baseParams });

    await expect(second).rejects.toMatchObject<StoryGenerationError>({ code: "in_flight" });
    release();
    await expect(first).resolves.toBeTruthy();
  });
});
