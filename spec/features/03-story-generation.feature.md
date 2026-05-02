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

Asset fallback:
When the Stitch MCP fetch is unavailable or incomplete, use `external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/` as the fallback source for the Result screen reference. The expected source files are `screen.png` and `code.html`; imported copies live in `frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/`.

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
- Product decision: Result visual parity should use the Stitch MCP reference when available; if MCP fetching fails, continue with the checked-in `external-assets/` fallback rather than pausing implementation.

## Implementation Plan

1. Validate the request in the frontend before generation.
2. Build a structured prompt from the input.
3. Call the configured LLM provider through a frontend service wrapper for local testing.
4. Normalize the provider response.
5. Return a typed result to the UI.
6. Render the generated story in the Stitch Result screen layout.

## PM Analysis - 2026-05-02

Goal:
Deliver the first complete parent flow from validated creation input to a generated Portuguese story result.

User flow:
The parent fills the Create form, submits once, waits on the Create screen with clear loading feedback, then lands on a Result screen containing a title, story text, reading estimate, and primary actions. If generation fails, the parent stays on Create and can retry without losing the submitted inputs.

Stories:
- As a parent, I want the generated story to include the child's name and selected theme/type so it feels intentional and personal.
- As a parent, I want the app to keep the story safe and age-appropriate so I can trust it for bedtime or family reading.
- As a parent, I want a clear retry path when generation fails so I do not have to rebuild the request from scratch.
- As an implementer, I want a local asset fallback when Stitch MCP fetches fail so Result screen work can continue without external tooling availability.

First-version scope:
- Use deterministic, dev-safe generation/provider behavior until a backend-mediated real provider path is approved.
- Generate one complete non-streaming story per valid submit.
- Keep all loading and retry messaging in Portuguese.
- Persist successful stories through the local storage boundary, but do not block Result rendering on storage failure.
- Match the `Resultado da História` visual reference using MCP assets first, then `external-assets/` fallback files if MCP is unavailable.

Out of scope:
- Real browser-bundled provider secrets.
- Streaming generation.
- Story editing after generation.
- Image generation for stories.
- Backend provider proxy unless a real provider is required for MVP acceptance.

PM TODO:
- [X] Confirm `Resultado da História` fallback files exist under `external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/`.
- [X] Document fallback asset path in this feature spec.
- [ ] Confirm final Result action labels before implementation: play narration, save favorite, create another, and view history may belong to later feature specs.
- [ ] Resolve whether prompt-level safety is enough for MVP or whether generated text requires a second validation/moderation pass.

## Tech Lead Overview

Technical approach:
Implement generation as a frontend-owned orchestration boundary behind a `story-generation` service. Keep prompt construction pure and deterministic in `prompt-builder`, use shared `StoryParams` domain values from the Create flow, normalize provider output into a typed generated-story result, and let the app shell own the async lifecycle: loading remains in Create, success reveals Result, failure returns actionable Portuguese messaging in Create. Isolate the local LLM provider call behind a small adapter so the MVP can later move the same contract behind a backend endpoint without rewriting UI state.

Affected areas:
`frontend/src/domain/story.ts`, `frontend/src/components/create-tab.tsx`, `frontend/src/components/tab-shell.tsx`, new frontend generation/prompt modules, Result screen component/state, frontend tests, and the future local storage service boundary.

Dependencies:
- Feature 02 must expose validated `StoryParams` through `CreateTab onSubmit(params: StoryParams)`.
- Stitch Result references should be downloaded before final visual parity work; if MCP fetch is unavailable, use `external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/`.
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

## Tech Lead Comment - 2026-05-02

Implementation blocker:
Do not implement real OpenAI or other paid LLM API calls directly from the browser. Feature 03 can proceed with a frontend `story-generation` boundary only if the provider adapter is mock/local/dev-safe and does not require committed or bundled secrets. If MVP acceptance requires real provider calls, the scope must add a minimal backend proxy despite the current out-of-scope note for a dedicated backend API.

Implementation guidance:
- Keep `buildStoryPrompt(params)` and response normalization frontend-owned and fully tested.
- Define the provider adapter as an interface so the first implementation can use a deterministic fake/local adapter and a later backend endpoint can satisfy the same contract.
- Treat malformed output, refused output, and provider unavailable states as first-class typed errors with Portuguese retry copy in Create.
- Do not block Result rendering on local persistence; surface storage failure as recoverable session state.

## Tech Lead Addendum - 2026-05-02

Additional decisions recommended before coding:
- Define one canonical provider response contract for MVP. Prefer structured JSON-shaped output at the adapter boundary: `title`, `text`, optional `estimatedMinutes`, and `promptVersion`. Do not let UI components parse raw provider text.
- Define one canonical generation error union before wiring UI copy. Minimum cases: `invalid_input`, `provider_unavailable`, `malformed_output`, `refused_output`, and `empty_output`.
- Keep persistence behind a `saveGeneratedStory(story)` boundary owned by Feature 03, but keep storage technology details owned by Feature 05. Feature 03 should depend on the interface, not on IndexedDB implementation details.
- Add a generated story `id` at normalization time so Result, Narration, Favorites, and History can all reference the same entity shape later.

Recommended implementation sequence:
1. Freeze the typed request/result/error contracts in the story domain.
2. Implement and test `buildStoryPrompt(params)` as a pure function.
3. Implement the provider adapter contract with a deterministic fake/local adapter.
4. Implement normalization plus fallback derivations such as `estimatedMinutes`.
5. Wire Create loading/error/success transitions against the typed service boundary.
6. Hand off successful stories to persistence through the storage interface.
7. Finish Result parity once the behavioral path is stable.

Additional engineering tasks:
- [ ] Define the canonical generated-story entity shape, including stable `id`, `createdAt`, `promptVersion`, and original `StoryParams`.
- [ ] Define a typed generation error union and map each case to Portuguese retry/recovery copy outside UI components.
- [ ] Specify and test the provider adapter response contract so provider-specific parsing stays out of the Result screen and app shell.
- [ ] Add a non-persistent session fallback so a storage write failure still leaves the freshly generated story readable until navigation changes.

## TODO

- [X] Download `Resultado da História` Stitch references into `frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/`.
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

## QA Test Guidance - 2026-05-02

Acceptance criteria:
- A valid `StoryParams` payload from Create starts exactly one generation request and keeps the user on Create with visible Portuguese loading feedback until it resolves.
- A successful generation result renders the Result screen with title, story text, estimated minutes, and Portuguese-first actions/copy.
- The generated story includes the submitted child name, respects theme/type/duration instructions, and records the prompt version used.
- Provider errors, malformed provider responses, refused/empty output, and invalid input are recoverable in Create with actionable Portuguese retry messaging.
- Successful generation is handed to local persistence, but a storage failure does not hide the generated Result from the current session.
- Automated tests must not call a real LLM provider or require real API keys.

Automation candidates:
- Unit test `buildStoryPrompt(params)` for mandatory safety rules, Portuguese output instruction, child name inclusion, age-band vocabulary/conflict guidance, duration targets, theme guidance, and special-detail handling.
- Unit test bedtime prompts to ensure calm pacing and no cliffhanger instruction.
- Unit test educational and moral prompts to ensure the lesson is shown through character action rather than stated only as a lecture.
- Unit test response normalization for valid structured output, whitespace trimming, missing estimated minutes fallback, missing title fallback/rejection decision, prompt version propagation, and malformed JSON/text rejection.
- Service test `story-generation` with a mocked provider for success, provider unavailable, refused content, malformed output, empty story text, and duplicate in-flight submit protection.
- Component/integration test the Create-to-Result flow: submit valid form, assert loading stays in Create, resolve mocked generation, assert Result appears, assert generated story is passed to persistence.
- Component/integration test failure flow: provider rejects, Create remains visible, retry copy appears, retry calls generation again once.
- Component/integration test persistence failure flow: generation succeeds, persistence rejects, Result still renders and a recoverable storage warning/state is available.

Regression checks:
- Existing Feature 02 validation tests should remain green; Feature 03 must not loosen `StoryParams` validation or alter valid submit payload shape.
- Loading state must continue to block duplicate submits.
- Result transition must not occur on failed generation.
- No test or source file should introduce committed provider secrets or browser-bundled real API keys.

Manual checks:
- Compare Result screen against the `Resultado da História` Stitch reference on mobile and desktop for layout, clipping, action hierarchy, and readable long story text.
- Verify Portuguese copy for loading, success, retryable errors, storage warnings, and Result actions.
- Verify generated long text scrolls/readability without overlapping fixed navigation or controls.

Residual risks:
- Prompt tests can prove instructions are present, but they cannot prove real LLM safety. If real provider output is required for MVP, add moderation or a backend-mediated validation step before shipping.
- Deterministic fake-provider tests may miss provider-specific response quirks; add adapter contract tests when the real provider path is chosen.

## QA Test Scenarios - 2026-05-02

Functional scenarios:
1. Valid generate request succeeds
   Given the parent is on Create with a valid `StoryParams` payload
   When generation starts and the provider returns a valid structured story
   Then Create keeps visible loading feedback in Portuguese
   And only one request is sent
   And Result renders the generated title, story text, estimated minutes, and Portuguese-first actions
   And the generated story is passed to persistence with prompt version and original params

2. Invalid request is rejected before provider call
   Given Create submits invalid or incomplete params to the generation boundary
   When the generation service validates the request
   Then no provider call is made
   And Create remains visible
   And the user sees a clear Portuguese recovery message

3. Provider unavailable error stays in Create
   Given a valid request
   When the provider adapter rejects with unavailable status
   Then loading ends
   And Result does not render
   And Create shows actionable Portuguese retry messaging
   And the previous form inputs remain intact

4. Malformed provider output is rejected
   Given a valid request
   When the provider returns malformed JSON, missing story text, or unusable shape
   Then the response is normalized into a typed failure
   And Result does not render
   And Create shows retry guidance instead of crashing

5. Refused or empty provider output is handled explicitly
   Given a valid request
   When the provider returns refusal content or an empty story body
   Then the generation flow maps the outcome to `refused_output` or `empty_output`
   And the user remains in Create with Portuguese retry guidance

6. Missing estimated minutes falls back safely
   Given a valid provider story response without `estimatedMinutes`
   When normalization completes
   Then a fallback estimated reading time is computed
   And Result still renders successfully

7. Duplicate submit is blocked while loading
   Given generation is already in flight
   When the parent clicks submit again or presses Enter repeatedly
   Then no second provider call is made
   And loading remains on the first request only

8. Persistence failure does not hide success
   Given generation succeeds
   When saving the generated story fails
   Then Result still renders the generated story
   And the generated story remains readable in session state
   And any storage warning is recoverable and non-blocking

9. Retry after failure succeeds cleanly
   Given the first generation attempt fails
   When the parent retries from Create and the next provider response succeeds
   Then the previous error state clears
   And Result renders only the successful story
   And only the successful story is persisted

Edge cases:
- Child age boundary coverage: ensure prompts and normalized results behave correctly for ages `1` and `12`.
- Long but valid `specialDetail`: ensure it is included in prompt construction without breaking layout or output normalization.
- Bedtime story generation: verify prompt instructions require calm pacing and no cliffhanger ending.
- Educational and moral story generation: verify prompt instructions require the lesson to appear through character action.
- Provider returns excessive whitespace around fields: ensure normalization trims output before Result render.
- Provider returns a title but blank text: treat as failure, not partial success.
- Provider returns text but missing title: confirm the intended behavior is either deterministic title fallback or typed rejection, and test that chosen rule explicitly.
- Very long generated story text: ensure Result remains readable and scrollable without clipping action controls.

Regression checks:
- Feature 02 submit validation and payload shape remain unchanged.
- Create continues to preserve draft state across retries and failed generations.
- Result never appears before a successful normalized story exists.
- Generation logic does not introduce committed secrets, browser-bundled real API keys, or real-provider test dependencies.
- Storage integration remains behind the agreed save boundary and does not leak IndexedDB-specific logic into generation orchestration.

Manual checks:
- Verify loading copy, retry copy, storage warning copy, and Result actions are Portuguese-first and fit mobile and desktop widths.
- Compare Result against the Stitch `Resultado da História` reference for hierarchy, spacing, long-text readability, and primary action treatment.
- Verify repeated tapping/clicking during loading does not visually or functionally create duplicate requests.
- Verify a successful generation followed by storage failure still leaves the story visible until the user navigates away.

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
