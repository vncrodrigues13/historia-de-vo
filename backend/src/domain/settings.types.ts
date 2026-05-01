import type { SleepTimerOption, VoiceOption } from "./story.types";

export type UserSettings = {
  defaultVoice: VoiceOption;
  defaultSpeed: number;
  defaultSleepTimer: SleepTimerOption;
};

