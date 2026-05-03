import {
  DEFAULT_USER_SETTINGS,
  SETTINGS_STORAGE_KEY,
  loadUserSettings,
  saveUserSettings
} from "@/services/settings-storage";

describe("settings storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns safe defaults when no settings exist", () => {
    expect(loadUserSettings()).toEqual(DEFAULT_USER_SETTINGS);
  });

  it("persists and reloads default story and reader preferences", () => {
    const settings = {
      defaultStoryDuration: "long",
      defaultStoryType: "educational",
      defaultSleepTimer: "20m",
      defaultVoice: "animated_female",
      defaultSpeed: 1.25
    } as const;

    saveUserSettings(settings);

    expect(loadUserSettings()).toEqual(settings);
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "{}")).toMatchObject(settings);
  });

  it("falls back to safe defaults for malformed JSON", () => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, "not-json");

    expect(loadUserSettings()).toEqual(DEFAULT_USER_SETTINGS);
  });

  it("normalizes unsupported option values and preserves valid legacy fields", () => {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        defaultStoryDuration: "weekend",
        defaultStoryType: "bedtime",
        defaultSleepTimer: "never",
        defaultVoice: "soft_male",
        defaultSpeed: 99
      })
    );

    expect(loadUserSettings()).toEqual({
      ...DEFAULT_USER_SETTINGS,
      defaultStoryType: "bedtime",
      defaultVoice: "soft_male"
    });
  });

  it("fills missing fields from defaults for legacy settings", () => {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        defaultSleepTimer: "10m"
      })
    );

    expect(loadUserSettings()).toEqual({
      ...DEFAULT_USER_SETTINGS,
      defaultSleepTimer: "10m"
    });
  });
});
