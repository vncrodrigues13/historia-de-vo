# Feature: Sleep Timer

Goal:
Stop narration automatically for bedtime listening.

User value:
The parent can start a story and let the audio end gently.

Priority:
Should have for MVP validation.

Development area:
Frontend. This feature controls browser audio playback state, timer state, and fade-out behavior.

## User Flow

1. The parent opens a story.
2. The parent selects 10, 20, 30 minutes, or end of story.
3. The timer starts during playback.
4. The app fades volume near the end and stops playback.

## Requirements

- Timer options: 10 minutes, 20 minutes, 30 minutes, end of story.
- Bedtime stories should suggest using the timer.
- Fade out during the last 2 minutes for timed options.
- Stopping the timer should restore normal volume.

## Implementation Plan

1. Create a timer state model.
2. Connect timer state to the audio player.
3. Add timer controls near playback.
4. Apply fade-out before stopping.

## TODO

- [ ] Create `sleep-timer` component.
- [ ] Add timer options.
- [ ] Stop playback at timer end.
- [ ] Add fade-out behavior.
- [ ] Suggest timer for bedtime stories.
- [ ] Reset volume after timer stop.

## Acceptance Seeds

- Timer stops playback at the selected time.
- End-of-story mode stops when audio ends.
- Fade-out lowers volume gradually.
- Canceling the timer keeps playback running.

## Open Questions

- Should fade-out use the native audio volume or Web Audio API?

## Out of Scope

- Custom timer duration.
- Background ambient sounds.
