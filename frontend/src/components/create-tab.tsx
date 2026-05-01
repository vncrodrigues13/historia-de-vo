import type { StoryDuration, StoryTheme, StoryType } from "@/domain/story";

export type StoryDraftState = {
  childName: string;
  childAge: number;
  theme: StoryTheme;
  storyType: StoryType;
  duration: StoryDuration;
  specialDetail: string;
};

type CreateTabProps = {
  draft: StoryDraftState;
  onDraftChange: (next: StoryDraftState) => void;
};

const storyThemes: StoryTheme[] = [
  "adventure",
  "animals",
  "space",
  "princess_prince",
  "dinosaurs",
  "fantasy_magic",
  "nature"
];

const storyTypes: StoryType[] = ["funny", "educational", "bedtime", "moral_lesson"];
const storyDurations: StoryDuration[] = ["short", "medium", "long"];

export function CreateTab({ draft, onDraftChange }: CreateTabProps) {
  return (
    <section aria-label="Create section">
      <h2 className="section-title">Create</h2>
      <p className="section-copy">Configure story details and keep your draft while you switch tabs.</p>
      <form className="story-form">
        <label htmlFor="child-name">
          Child name
          <input
            id="child-name"
            name="childName"
            value={draft.childName}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                childName: event.target.value
              })
            }
          />
        </label>

        <label htmlFor="child-age">
          Child age
          <input
            id="child-age"
            name="childAge"
            type="number"
            min={1}
            max={12}
            value={draft.childAge}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                childAge: Number(event.target.value)
              })
            }
          />
        </label>

        <label htmlFor="theme">
          Theme
          <select
            id="theme"
            value={draft.theme}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                theme: event.target.value as StoryTheme
              })
            }
          >
            {storyThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="story-type">
          Story type
          <select
            id="story-type"
            value={draft.storyType}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                storyType: event.target.value as StoryType
              })
            }
          >
            {storyTypes.map((storyType) => (
              <option key={storyType} value={storyType}>
                {storyType}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="duration">
          Duration
          <select
            id="duration"
            value={draft.duration}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                duration: event.target.value as StoryDuration
              })
            }
          >
            {storyDurations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="special-detail">
          Special detail
          <textarea
            id="special-detail"
            name="specialDetail"
            value={draft.specialDetail}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                specialDetail: event.target.value
              })
            }
          />
        </label>
      </form>
      <div className="state-preview" role="status">
        Current draft: {draft.childName || "no name yet"} / {draft.theme} / {draft.storyType}
      </div>
    </section>
  );
}

