import type { UserSettings } from "@/domain/settings";
import type { SleepTimerOption, StoryDuration, StoryType, VoiceOption } from "@/domain/story";

export const SETTINGS_STORAGE_KEY = "contos-de-ninar:user-settings";
export const SETTINGS_STORAGE_VERSION = 1;

export const DEFAULT_USER_SETTINGS: UserSettings = {
  defaultStoryDuration: "short",
  defaultStoryType: "bedtime",
  defaultVoice: "soft_female",
  defaultSpeed: 1,
  defaultSleepTimer: "none"
};

const storyDurations: StoryDuration[] = ["short", "medium", "long"];
const storyTypes: StoryType[] = ["funny", "educational", "bedtime", "moral_lesson"];
const voices: VoiceOption[] = ["soft_female", "soft_male", "animated_female", "animated_male"];
const speeds = [0.85, 1, 1.25];
const sleepTimers: SleepTimerOption[] = ["none", "10m", "20m", "30m", "end_of_story"];

function isOneOf<Option extends string>(value: unknown, options: Option[]): value is Option {
  return typeof value === "string" && options.includes(value as Option);
}

function normalizeSettings(value: unknown): UserSettings {
  if (!value || typeof value !== "object") {
    return DEFAULT_USER_SETTINGS;
  }

  const record = value as Partial<UserSettings>;

  return {
    defaultStoryDuration: isOneOf(record.defaultStoryDuration, storyDurations)
      ? record.defaultStoryDuration
      : DEFAULT_USER_SETTINGS.defaultStoryDuration,
    defaultStoryType: isOneOf(record.defaultStoryType, storyTypes)
      ? record.defaultStoryType
      : DEFAULT_USER_SETTINGS.defaultStoryType,
    defaultVoice: isOneOf(record.defaultVoice, voices)
      ? record.defaultVoice
      : DEFAULT_USER_SETTINGS.defaultVoice,
    defaultSpeed: typeof record.defaultSpeed === "number" && speeds.includes(record.defaultSpeed)
      ? record.defaultSpeed
      : DEFAULT_USER_SETTINGS.defaultSpeed,
    defaultSleepTimer: isOneOf(record.defaultSleepTimer, sleepTimers)
      ? record.defaultSleepTimer
      : DEFAULT_USER_SETTINGS.defaultSleepTimer
  };
}

export function loadUserSettings(): UserSettings {
  if (typeof window === "undefined") {
    return DEFAULT_USER_SETTINGS;
  }

  const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_USER_SETTINGS;
  }

  try {
    return normalizeSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeSettings(settings);
  window.localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      settingsVersion: SETTINGS_STORAGE_VERSION,
      ...normalized
    })
  );
}
