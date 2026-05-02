# Feature: Story Narration Player

Goal:
Provide a frontend reading and playback surface for generated stories, with provider-backed audio deferred until a later phase.

User value:
The child can follow the story in a focused reader, and the app can later add listening without changing the saved story model.

Priority:
Should have after text generation is usable.

Development area:
Frontend. This feature owns the reader/player UI state. TTS provider integration and dedicated narration APIs are out of scope for the current MVP.

Stitch screen:
Use `Resultado da História` from project `15204996058292121576`, screen `2f52b97627124271b828d2781e99ae86`, as the reader/player visual reference.

## User Flow

1. The parent opens a generated or saved story.
2. The parent opens the focused reader/player surface.
3. The parent can start, pause, resume, and restart supported local playback behavior when available.
4. If audio is unavailable, the story remains readable without a failed provider flow.

## Requirements

- Create a frontend reader/player component for generated and saved stories.
- Keep playback state local to the frontend.
- Do not require provider-backed TTS for the current MVP.
- If browser-native speech synthesis is used during prototyping, isolate it behind a frontend service.
- Use the browser audio output selected by the operating system when playback exists.
- Reader/player controls should align with the Stitch Result screen and remain functional when audio is unavailable.

## Implementation Plan

1. Review the extracted Stitch Result screen controls.
2. Create a focused reader/player component.
3. Model local playback state: idle, playing, paused, ended, and unavailable.
4. Optionally wrap browser-native speech synthesis in a frontend service for prototype playback.
5. Handle unavailable playback without blocking reading.
6. Keep the saved story model independent from any future TTS provider.

## TODO

- [ ] Reuse the extracted `Resultado da História` reference for reader/player layout.
- [ ] Create reader/player state types.
- [ ] Create `story-player` component.
- [ ] Add play, pause, resume, and restart.
- [ ] Add unavailable playback state.
- [ ] Keep future voice and speed controls out of the MVP unless browser-native playback is enabled.

## Acceptance Seeds

- A generated story can be opened in the reader/player.
- Play, pause, resume, and restart work.
- Unavailable playback shows a recoverable local message and does not hide the story text.
- The implementation does not require a backend endpoint.

## Open Questions

- Should the MVP use browser-native speech synthesis as a temporary local playback option, or keep this as reader-only until TTS is selected?

## Out of Scope

- Dedicated narration API.
- Provider-backed TTS.
- Exporting MP3 files.
- Background music.
- Direct Alexa or Google Home integration.
