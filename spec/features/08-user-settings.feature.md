# Feature: User Settings

Goal:
Persist simple app preferences on the device.

User value:
The parent does not need to choose the same local story preferences every time.

Priority:
Should have.

Development area:
Frontend. This feature stores local preferences and applies them to story creation and reader defaults.

Stitch screen:
`Configurações 2` from project `15204996058292121576`, screen `ce4a28b488d7451e90827057767e6fb9`.

## User Flow

1. The parent opens Settings.
2. The parent selects default story and reader preferences.
3. The app saves preferences locally.
4. New stories and saved stories use these defaults where applicable.

## Requirements

- Store settings in localStorage.
- Support default story duration.
- Support default story type.
- Support default sleep timer.
- Use safe defaults when no settings exist.
- Settings screen should match the extracted Stitch layout, section grouping, controls, and save feedback.
- User-facing settings copy should be Portuguese-first.

## Implementation Plan

1. Extract the Stitch image and code reference for `Configurações 2`.
2. Create settings storage service.
3. Build the Settings section to match the Stitch reference.
4. Load defaults when the app starts.
5. Apply settings to story creation and reader behavior.

## TODO

- [ ] Download `Configurações 2` Stitch references into `frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/`.
- [ ] Implement `settings-storage`.
- [ ] Create Settings section.
- [ ] Match the Stitch Settings screen layout, control grouping, and save feedback.
- [ ] Save default story duration.
- [ ] Save default story type.
- [ ] Save default timer.
- [ ] Apply defaults to new story sessions.

## Acceptance Seeds

- Settings persist after reload.
- New stories use the saved default story preferences.
- Timer default appears when opening a story.
- Missing settings fall back to safe defaults.

## Open Questions

- Should saved stories keep their original creation preferences or use current defaults when reopened?

## Out of Scope

- Child profiles.
- Account-level preferences.
- Sync across devices.
