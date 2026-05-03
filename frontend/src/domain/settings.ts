import type { SleepTimerOption, StoryDuration, StoryType, VoiceOption } from "./story";

export type UserSettings = {
  defaultStoryDuration: StoryDuration;
  defaultStoryType: StoryType;
  defaultVoice: VoiceOption;
  defaultSpeed: number;
  defaultSleepTimer: SleepTimerOption;
};
