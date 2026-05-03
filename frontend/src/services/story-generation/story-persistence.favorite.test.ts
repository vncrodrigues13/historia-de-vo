import type { SavedStory } from "@/domain/story";
import { toggleFavorite } from "@/services/story-generation/story-persistence";

const STORAGE_KEY = "contos-de-ninar:saved-stories";

const baseStory: SavedStory = {
  id: "story-luna-1",
  title: "A Floresta de Luna",
  text: "Luna encontrou uma coruja gentil.",
  params: {
    childName: "Luna",
    childAge: 6,
    theme: "animals",
    storyType: "bedtime",
    duration: "short",
    specialDetail: "ama estrelas"
  },
  voice: "soft_female",
  speed: 1,
  favorite: false,
  createdAt: "2026-05-01T20:00:00.000Z",
  updatedAt: "2026-05-01T20:00:00.000Z",
  promptVersion: "story-v1.0.0"
};

function writeStories(stories: SavedStory[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

function readStories(): SavedStory[] {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as SavedStory[];
}

describe("toggleFavorite", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-02T10:30:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("sets favorite and updates only favorite plus updatedAt", async () => {
    writeStories([baseStory]);

    const result = await toggleFavorite("story-luna-1", true);

    expect(result).toMatchObject({ status: "updated" });
    expect(readStories()).toEqual([
      {
        ...baseStory,
        favorite: true,
        updatedAt: "2026-05-02T10:30:00.000Z"
      }
    ]);
  });

  it("flips the current favorite value when nextFavorite is omitted", async () => {
    writeStories([{ ...baseStory, favorite: true }]);

    await toggleFavorite("story-luna-1");

    expect(readStories()[0]).toMatchObject({
      id: "story-luna-1",
      favorite: false,
      updatedAt: "2026-05-02T10:30:00.000Z"
    });
  });

  it("returns a typed no-op for a missing id and leaves storage unchanged", async () => {
    writeStories([baseStory]);

    const result = await toggleFavorite("missing-story", true);

    expect(result).toEqual({ status: "not_found", storyId: "missing-story" });
    expect(readStories()).toEqual([baseStory]);
  });

  it("does not mutate createdAt, promptVersion, content, or params", async () => {
    writeStories([baseStory]);

    await toggleFavorite("story-luna-1", true);

    const updated = readStories()[0];
    expect(updated.createdAt).toBe(baseStory.createdAt);
    expect(updated.promptVersion).toBe(baseStory.promptVersion);
    expect(updated.text).toBe(baseStory.text);
    expect(updated.params).toEqual(baseStory.params);
  });
});
