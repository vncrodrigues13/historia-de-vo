import type { SavedStory, StoryParams } from "@/domain/story";
import type { UserSettings } from "@/domain/settings";
import type { GeneratedStory } from "@/domain/story-generation";
import { DEFAULT_USER_SETTINGS } from "@/services/settings-storage";

const STORAGE_KEY = "contos-de-ninar:saved-stories";

export type ToggleFavoriteResult =
  | { status: "updated"; story: SavedStory }
  | { status: "not_found"; storyId: string }
  | { status: "storage_error"; storyId: string };

function createId() {
  return `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeStory(record: SavedStory): SavedStory {
  return {
    ...record,
    favorite: Boolean(record.favorite)
  };
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
    if (!Array.isArray(parsed)) {
      return [];
    }
    return (parsed as SavedStory[]).map((record) => normalizeStory(record));
  } catch {
    return [];
  }
}

function writeStories(stories: SavedStory[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

export function listSavedStories(): SavedStory[] {
  return readStories();
}

export async function persistGeneratedStory(
  generated: GeneratedStory,
  settings: UserSettings = DEFAULT_USER_SETTINGS
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const now = generated.generatedAt;
  const record: SavedStory = {
    id: generated.id || createId(),
    title: generated.title,
    text: generated.text,
    params: generated.sourceParams as StoryParams,
    voice: settings.defaultVoice,
    speed: settings.defaultSpeed,
    sleepTimer: settings.defaultSleepTimer,
    favorite: false,
    createdAt: now,
    updatedAt: now,
    promptVersion: generated.promptVersion
  };

  const stories = readStories();
  stories.unshift(record);
  writeStories(stories);
}

export async function toggleFavorite(storyId: string, nextFavorite?: boolean): Promise<ToggleFavoriteResult> {
  if (typeof window === "undefined") {
    return { status: "not_found", storyId };
  }

  const stories = readStories();
  const index = stories.findIndex((story) => story.id === storyId);
  if (index < 0) {
    return { status: "not_found", storyId };
  }

  const current = stories[index];
  const updated: SavedStory = {
    ...current,
    favorite: typeof nextFavorite === "boolean" ? nextFavorite : !current.favorite,
    updatedAt: new Date().toISOString()
  };

  const updatedStories = [...stories];
  updatedStories[index] = updated;

  try {
    writeStories(updatedStories);
    return { status: "updated", story: updated };
  } catch {
    return { status: "storage_error", storyId };
  }
}
