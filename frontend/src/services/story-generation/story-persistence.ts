import type { SavedStory, StoryParams } from "@/domain/story";
import type { GeneratedStory } from "@/domain/story-generation";

const STORAGE_KEY = "contos-de-ninar:saved-stories";

function createId() {
  return `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function readStories(): SavedStory[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedStory[]) : [];
  } catch {
    return [];
  }
}

export async function persistGeneratedStory(generated: GeneratedStory): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const now = generated.generatedAt;
  const record: SavedStory = {
    id: generated.id || createId(),
    title: generated.title,
    text: generated.text,
    params: generated.sourceParams as StoryParams,
    voice: "soft_female",
    speed: 1,
    favorite: false,
    createdAt: now,
    updatedAt: now,
    promptVersion: generated.promptVersion
  };

  const stories = readStories();
  stories.unshift(record);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}
