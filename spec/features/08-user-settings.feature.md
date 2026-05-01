# Feature: User Settings

Goal:
Persist simple playback preferences on the device.

User value:
The parent does not need to choose the same narration settings every time.

Priority:
Should have.

Development area:
Frontend. This feature stores local preferences and applies them to story creation and narration defaults.

## User Flow

1. The parent opens Settings.
2. The parent selects default voice, speed, and timer.
3. The app saves preferences locally.
4. New stories and saved stories use these defaults where applicable.

## Requirements

- Store settings in localStorage.
- Support default voice.
- Support default speed.
- Support default sleep timer.
- Use safe defaults when no settings exist.

## Implementation Plan

1. Create settings storage service.
2. Build the Settings section.
3. Load defaults when the app starts.
4. Apply settings to story creation and narration.

## TODO

- [ ] Implement `settings-storage`.
- [ ] Create Settings section.
- [ ] Save default voice.
- [ ] Save default speed.
- [ ] Save default timer.
- [ ] Apply defaults to new story sessions.

## Acceptance Seeds

- Settings persist after reload.
- New stories use the saved voice and speed.
- Timer default appears when opening a story.
- Missing settings fall back to safe defaults.

## Open Questions

- Should saved stories keep their original voice and speed or use current defaults when reopened?

## Out of Scope

- Child profiles.
- Account-level preferences.
- Sync across devices.
