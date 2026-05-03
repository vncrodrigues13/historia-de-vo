export type StoryTheme =
  | "adventure"
  | "animals"
  | "space"
  | "princess_prince"
  | "dinosaurs"
  | "fantasy_magic"
  | "nature";

export type StoryType =
  | "funny"
  | "educational"
  | "bedtime"
  | "moral_lesson";

export type StoryDuration = "short" | "medium" | "long";

export type VoiceOption =
  | "soft_female"
  | "soft_male"
  | "animated_female"
  | "animated_male";

export type SleepTimerOption = "none" | "10m" | "20m" | "30m" | "end_of_story";

export type StoryParams = {
  childName: string;
  childAge: number;
  theme: StoryTheme;
  storyType: StoryType;
  duration: StoryDuration;
  specialDetail?: string;
};

export type SavedStory = {
  id: string;
  title: string;
  text: string;
  params: StoryParams;
  voice: VoiceOption;
  speed: number;
  sleepTimer?: SleepTimerOption;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  promptVersion: string;
};
