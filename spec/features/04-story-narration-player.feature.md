# Feature: Story Narration Player

Goal:
Convert a generated story into audio and play it in the browser.

User value:
The child can listen without interacting with the screen.

Priority:
Must have.

Development area:
Full stack. Backend owns the narration API and TTS adapter. Frontend owns voice and speed controls, audio playback, and player state.

## User Flow

1. The parent opens a generated or saved story.
2. The parent chooses voice and speed.
3. The app generates narration audio.
4. The parent can play, pause, resume, and restart.

## Requirements

- Create `POST /api/stories/narrate`.
- Use a TTS provider through an adapter.
- Support soft female, soft male, animated female, and animated male voice options.
- Support slow, normal, and fast speed.
- Use the browser audio output selected by the operating system.

## Implementation Plan

1. Validate narration input on the server.
2. Call the TTS provider through an adapter.
3. Return playable audio data to the client.
4. Create an audio player component.
5. Handle loading and provider errors.

## TODO

- [ ] Create narration request and response types.
- [ ] Implement `tts-provider` adapter.
- [ ] Implement `POST /api/stories/narrate`.
- [ ] Create `audio-player` component.
- [ ] Add play, pause, resume, and restart.
- [ ] Add voice and speed controls.

## Acceptance Seeds

- A generated story can be narrated.
- Play, pause, resume, and restart work.
- Changing speed affects narration request or playback.
- TTS errors show a recoverable message.

## Open Questions

- Should the API return base64 audio or a temporary file URL?

## Out of Scope

- Exporting MP3 files.
- Background music.
- Direct Alexa or Google Home integration.
