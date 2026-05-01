# Feature: Story Generation

Goal:
Generate one safe, age-appropriate story from the form input.

User value:
The parent receives a coherent story that uses the child name and follows the selected theme and type.

Priority:
Must have.

Development area:
Backend primary, with a small frontend integration. Backend owns request validation, prompt building, LLM provider calls, and API responses. Frontend owns loading, success, and error states.

## User Flow

1. The parent submits valid story parameters.
2. The app shows a loading message.
3. The API generates a title and story text.
4. The story appears in the reader.
5. The story is saved locally.

## Requirements

- Create `POST /api/stories/generate`.
- Build prompts in a pure `prompt-builder` function.
- Include child safety rules in every prompt.
- Adapt vocabulary and conflict level to the child age.
- Return title, text, estimated minutes, and prompt version.

## Implementation Plan

1. Validate the request on the server.
2. Build a structured prompt from the input.
3. Call the configured LLM provider through an adapter.
4. Normalize the provider response.
5. Return a typed response to the UI.

## TODO

- [ ] Create request and response types.
- [ ] Implement server-side validation.
- [ ] Implement `prompt-builder`.
- [ ] Implement `llm-provider` adapter.
- [ ] Add loading, success, and error UI states.
- [ ] Hand the generated story to local storage.

## Acceptance Seeds

- A valid request returns a title and story text.
- Invalid input returns a clear error.
- Bedtime stories avoid cliffhangers and use calmer pacing.
- Educational and moral stories show the lesson through character action.

## Open Questions

- Should the MVP add moderation after generation, or only prompt safety rules?

## Out of Scope

- Streaming generation.
- Editing the generated story.
- Image generation.
