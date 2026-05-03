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

Asset fallback:
When the Stitch MCP fetch is unavailable or incomplete, use `external-assets/stitch/stitch_contos_de_ninar_control_panel/configura_es_2/` as the fallback source for the Settings screen reference. The expected source files are `screen.png` and `code.html`; imported copies live in `frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/`.

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
- Product decision: Settings visual parity should use the Stitch MCP reference when available; if MCP fetching fails, continue with the checked-in `external-assets/` fallback.

## Implementation Plan

1. Extract the Stitch image and code reference for `Configurações 2`.
2. Create settings storage service.
3. Build the Settings section to match the Stitch reference.
4. Load defaults when the app starts.
5. Apply settings to story creation and reader behavior.

## Tech Lead Overview

Technical approach:
Create a frontend-only settings module that owns safe defaults, localStorage serialization, runtime validation, and versioned normalization. Keep the React Settings screen as a controlled form with local draft state and explicit save feedback. Apply story defaults when initializing a new Create draft, and apply reader defaults when opening generated or saved stories without mutating the original saved story parameters.

Affected areas:
`frontend/src/domain/settings.ts`, `frontend/src/domain/story.ts`, `frontend/src/components/settings-tab.tsx`, `frontend/src/components/tab-shell.tsx`, `frontend/src/components/create-tab.tsx`, story persistence defaults in `frontend/src/services/story-generation/story-persistence.ts`, shared styles in `frontend/app/globals.css`, and frontend tests.

Dependencies:
- Settings option values must reuse existing `StoryDuration`, `StoryType`, `SleepTimerOption`, `VoiceOption`, and playback speed domain types where applicable.
- The Settings Stitch reference should be imported into `frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/` before final visual parity review.
- If Stitch MCP export is unavailable, continue from the configured fallback source instead of blocking implementation.
- Feature 04/07 reader and sleep-timer behavior need a read-only settings boundary so defaults can be consumed without coupling those components to localStorage.

Engineering tasks:
- [ ] Define `DEFAULT_USER_SETTINGS`, a storage key, a storage version, and `loadUserSettings` / `saveUserSettings` helpers.
- [ ] Normalize invalid, missing, or legacy localStorage values back to safe defaults without throwing during app render.
- [ ] Extend `UserSettings` to include default story duration and default story type, or rename existing fields so the type matches this feature's requirements.
- [ ] Update `TabShell` to load settings once on the client, pass the active settings to Create/Result flows, and refresh consumers after save.
- [ ] Initialize new Create drafts from saved default duration and story type while preserving user edits during the current draft session.
- [ ] Update story persistence so newly generated stories store the selected reader defaults (`voice`, `speed`) from current settings instead of hard-coded values.
- [ ] Build `SettingsTab` with Portuguese-first labels, grouped controls, accessible field names, save confirmation, and localStorage error feedback.
- [ ] Add unit tests for settings load/save, invalid JSON, unsupported option values, missing fields, and safe fallback behavior.
- [ ] Add component/integration tests for saving settings, reload persistence, Create default application, reader/timer default application, and save-error feedback.

Testing notes:
Prefer pure tests for the storage/normalization module and component tests for user-visible behavior. Mock `window.localStorage` failures to verify the app remains usable. Cover both the first-load case with no settings and the reload case with stored settings. Include at least one regression test proving existing saved story `params` remain unchanged when current defaults change.

Risks:
- The current `UserSettings` type only covers voice, speed, and sleep timer, while the feature requires default story duration and type.
- The current Create draft is initialized from static values in `TabShell`; settings must not overwrite an in-progress draft after the parent has started editing.
- `persistGeneratedStory` currently hard-codes voice and speed, so reader defaults will silently be ignored unless persistence receives current settings.
- localStorage can contain malformed or stale values; direct casts would make settings brittle across future option changes.

Open technical questions:
- Product should confirm whether saved stories keep their original reader preferences (`voice`, `speed`, timer) or use current settings when reopened. Technical recommendation: keep story creation `params` immutable, store reader preferences with saved stories when generated, and use current settings only as the fallback for older records missing those fields.

## TODO

- [ ] Download `Configurações 2` Stitch references into `frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/`.
- [ ] If MCP export is unavailable, import the Settings reference from `external-assets/stitch/stitch_contos_de_ninar_control_panel/configura_es_2/`.
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

## QA Analysis - 2026-05-02

Coverage assessment:
The feature is testable but needs explicit coverage at both the storage normalization boundary and the user-visible Settings/Create/Result flows. The highest-risk areas are malformed localStorage data, defaults not being applied to new story sessions, and reader defaults being ignored during persistence.

Acceptance criteria:
- Missing settings load safe defaults without throwing during app render.
- Invalid JSON, unsupported option values, and missing legacy fields normalize back to supported defaults.
- Settings screen uses Portuguese-first copy, grouped controls, accessible group names, and save feedback.
- Saved settings persist in localStorage and are reloaded after remount/reload.
- New Create sessions initialize from saved default story type and duration.
- Saving settings must not overwrite an in-progress Create draft.
- Newly generated saved stories store current reader defaults such as voice and playback speed.
- Storage save failures show retryable Portuguese feedback and keep the app usable.

Automation coverage added:
- Unit tests for `DEFAULT_USER_SETTINGS`, `SETTINGS_STORAGE_KEY`, `loadUserSettings`, and `saveUserSettings`.
- Unit tests for malformed JSON, unsupported option values, missing fields, and safe fallback behavior.
- Component tests for Portuguese Settings layout, grouped controls, save confirmation, and localStorage persistence.
- Integration tests for applying saved story defaults to Create, preserving draft edits after saving settings, and persisting reader defaults on generated stories.
- Failure-path test for localStorage save errors with retryable Portuguese feedback.

Manual checks:
1. Compare Settings screen against the Stitch/fallback reference on mobile and desktop.
2. Save each supported story type, duration, and timer option, then reload and confirm selected state.
3. Start editing a story, change settings, return to Create, and confirm the draft was not reset.
4. Generate a story after changing reader defaults and confirm the saved story opens with the expected reader defaults.

Residual risks:
- Final reader behavior depends on Feature 04/07 implementation details; tests currently lock persistence of reader defaults, not full playback behavior.
- Product still needs to confirm whether previously saved stories keep original reader settings or use current settings as fallback only.
