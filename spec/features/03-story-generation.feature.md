# Feature: Story Generation

Goal:
Generate one safe, age-appropriate story from the form input.

User value:
The parent receives a coherent story that uses the child name and follows the selected theme and type.

Priority:
Must have.

Development area:
Frontend. The browser app owns form validation, prompt building, local provider calls, response normalization, loading states, success states, error states, and local persistence.

Stitch screen:
`Resultado da História` from project `15204996058292121576`, screen `2f52b97627124271b828d2781e99ae86`.

## User Flow

1. The parent submits valid story parameters.
2. The app shows a loading message.
3. The frontend generation service generates a title and story text.
4. The story appears in the reader.
5. The story is saved locally.

## Requirements

- Create a frontend `story-generation` service called by the Create screen.
- Build prompts in a pure `prompt-builder` function.
- Include child safety rules in every prompt.
- Adapt vocabulary and conflict level to the child age.
- Return title, text, estimated minutes, and prompt version.
- On success, navigate to or reveal a Result screen that matches the Stitch `Resultado da História` reference.
- Result screen copy and actions should be Portuguese-first.
- Product decision: while generating, keep loading feedback inside Create; transition to Result only when generation succeeds.
- Product decision: generation failures stay in Create and show actionable retry messaging in Portuguese.

## Implementation Plan

1. Validate the request in the frontend before generation.
2. Build a structured prompt from the input.
3. Call the configured LLM provider through a frontend service wrapper for local testing.
4. Normalize the provider response.
5. Return a typed result to the UI.
6. Render the generated story in the Stitch Result screen layout.

## Tech Lead Overview

Technical approach:
Implement generation as a frontend-owned orchestration boundary behind a `story-generation` service. Keep prompt construction pure and deterministic in `prompt-builder`, use shared `StoryParams` domain values from the Create flow, normalize provider output into a typed generated-story result, and let the app shell own the async lifecycle: loading remains in Create, success reveals Result, failure returns actionable Portuguese messaging in Create. Isolate the local LLM provider call behind a small adapter so the MVP can later move the same contract behind a backend endpoint without rewriting UI state.

Affected areas:
`frontend/src/domain/story.ts`, `frontend/src/components/create-tab.tsx`, `frontend/src/components/tab-shell.tsx`, new frontend generation/prompt modules, Result screen component/state, frontend tests, and the future local storage service boundary.

Dependencies:
- Feature 02 must expose validated `StoryParams` through `CreateTab onSubmit(params: StoryParams)`.
- Stitch Result references should be downloaded before final visual parity work.
- Local story persistence can be called through a narrow save boundary first, then backed by IndexedDB in Feature 05.
- Provider configuration must stay outside committed source. If direct browser provider calls are used for local MVP testing, secrets cannot be embedded in the client bundle.

Engineering tasks:
- [ ] Add frontend `GenerateStoryRequest` and `GeneratedStory`/response types that include title, text, estimated minutes, prompt version, source params, and generated timestamp.
- [ ] Create a pure `buildStoryPrompt(params: StoryParams)` function with age bands, theme/type instructions, duration targets, Portuguese output instructions, and mandatory child-safety rules.
- [ ] Add prompt-builder tests for bedtime pacing, educational/moral lesson guidance, age adaptation, special-detail inclusion, and safety rules.
- [ ] Implement `story-generation` service orchestration: validate accepted params, call the provider adapter, parse/normalize response, compute estimated minutes when missing, and return typed errors.
- [ ] Wire `TabShell`/app state so Create shows loading and retryable errors, Result appears only after success, and duplicate generation submits are blocked.
- [ ] Build the Result screen using the Stitch reference and Portuguese-first copy/actions.
- [ ] Hand successful generated stories to the local persistence boundary without blocking the Result render on non-critical storage failures.
- [ ] Add component/integration tests for valid generation, provider failure, malformed provider output, duplicate-submit prevention, Result transition, and storage handoff.

Testing notes:
Prioritize pure tests for prompt building and normalization, then integration-style component tests around the Create-to-Result lifecycle. Mock provider responses rather than calling a real LLM in automated tests. Add manual browser checks for loading, success, retryable error, mobile/desktop Result layout, and Portuguese copy.

Risks:
- Direct frontend provider calls can expose secrets; use only a safe local/testing provider path until a backend endpoint exists.
- LLM responses may be malformed or unsafe, so normalization and prompt constraints are necessary but not a full moderation substitute.
- Validation rules can drift between Create and generation unless generation reuses or intentionally narrows the accepted `StoryParams` contract.
- Persistence failure should not erase a successfully generated story from the current session.

Open technical questions:
- Which safe local provider mechanism will be used for the MVP without exposing API keys in the browser?
- Should generated text receive a second moderation/validation pass before Result render, or is prompt-level safety accepted for the first implementation?
- What exact Result actions are required in Feature 03 versus deferred to Narration, Favorites, and History?

## TODO

- [ ] Download `Resultado da História` Stitch references into `frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/`.
- [ ] Create request and response types.
- [ ] Implement frontend validation.
- [ ] Implement `prompt-builder`.
- [ ] Implement `story-generation` service wrapper.
- [ ] Add loading, success, and error UI states.
- [ ] Add Result screen state that matches the Stitch reference.
- [ ] Hand the generated story to local storage.
- [ ] Wire `CreateTab onSubmit(params: StoryParams)` to the real generation service boundary (not a stub promise).

## Acceptance Seeds

- A valid request returns a title and story text.
- Invalid input returns a clear error.
- Bedtime stories avoid cliffhangers and use calmer pacing.
- Educational and moral stories show the lesson through character action.

## Open Questions

- Should the MVP add moderation after generation, or only prompt safety rules?

## PM Resolution - 2026-05-02

Goal:
Unblock end-to-end implementation sequencing from Create to Generation.

Stories:
- Story Creation submits validated params.
- Story Generation performs request/response handling and returns typed output.
- Result view is shown only after success.

Implementation sequencing:
1. Replace app-shell submit stub with real generation service call.
2. Keep loading/error behavior in Create during request lifecycle.
3. Render Result on success and persist locally.
4. Apply Stitch parity refinements after behavior is complete.

## Out of Scope

- Streaming generation.
- Editing the generated story.
- Image generation.
- Dedicated backend API.
