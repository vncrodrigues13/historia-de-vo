# Feature: Favorite Stories

Goal:
Let the parent mark useful stories as favorites.

User value:
The parent can quickly find stories the child likes.

Priority:
Should have for MVP validation.

Development area:
Frontend. This feature updates local story records and renders the Favorites view.

Asset fallback:
This feature does not require a separate Stitch export. When Favorite actions reuse the History or Result references and the Stitch MCP fetch is unavailable, use the checked-in fallback assets under `external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/` and `external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/`.

## User Flow

1. The parent opens a story or sees it in History.
2. The parent toggles favorite.
3. The story appears in Favorites.
4. The parent can remove it from Favorites.

## Requirements

- Add a favorite flag to saved stories.
- Show favorite action in story cards and the reader.
- Create a Favorites section filtered by favorite stories.
- Keep the story in History after unfavoriting.
- Product decision: any Favorite UI derived from Stitch-backed History or Result screens should keep moving with the `external-assets/` fallback if MCP export is unavailable.

## Implementation Plan

1. Add favorite update to storage.
2. Add favorite toggle UI.
3. Build the Favorites list.
4. Reuse the story reader for favorite stories.

## TODO

- [ ] Add `favorite` update operation.
- [ ] Add favorite toggle in History.
- [ ] Add favorite toggle in story reader.
- [ ] Create Favorites section.
- [ ] Support removing from Favorites without deleting the story.

## Acceptance Seeds

- Favoriting a story adds it to Favorites.
- Unfavoriting removes it from Favorites.
- Favorited stories remain in History.
- Favorites persist after page reload.

## Open Questions

- Should the UI use a star or heart icon?

## Out of Scope

- Favorite folders.
- Ratings.
- Sorting favorites manually.

## Tech Lead Validation - 2026-05-02

Validation result:
The demand is valid for MVP and consistent with Feature 03/05 direction, but it needs explicit update semantics and UI-state rules to avoid regressions.

Implementation decisions:
- Canonical entity remains `SavedStory` in frontend domain/storage with `id` as stable key and `favorite: boolean` as persisted state.
- Favorite toggle must be an update operation by `id`, never a delete/replace of the full collection without merge safeguards.
- Toggling favorite must update `updatedAt` and preserve all other story fields (`title`, `text`, `params`, `promptVersion`, `createdAt`).
- If story `id` is not found during toggle, return typed no-op result and show non-blocking feedback; do not crash the screen.
- Favorites tab must be a filtered projection (`favorite === true`) over stored stories, not a separate duplicated store.
- Result screen favorite action should only appear when the story has already been persisted or has an in-session ID resolvable to storage.
- History and Favorites must stay consistent after one toggle action (single source of truth from storage read/update flow).

Required additions to requirements:
- Define one storage boundary for this feature: `toggleFavorite(storyId: string, nextFavorite?: boolean)`.
- Define conflict rule for rapid taps: disable repeated taps while one toggle operation is in-flight per story card.
- Define empty-state UX copy in Portuguese for Favorites when no favorited stories exist.
- Define persistence failure behavior: keep UI stable, revert optimistic state if used, and show retryable Portuguese message.

Testing requirements to add:
- Unit test storage toggle success updates only `favorite` and `updatedAt`.
- Unit test toggle for missing `id` returns safe no-op.
- Component test History card toggle updates icon/state and keeps record in History.
- Component test Favorites list includes only `favorite === true`.
- Component test unfavorite from Favorites removes item from Favorites view but not from History.
- Integration test reload persistence: favorited stories remain favorited after storage re-read.
- Regression test: toggling favorite does not mutate `createdAt` or `promptVersion`.

Open technical question to resolve before implementation:
- Should favorite toggle be optimistic in UI, or confirmed only after storage write resolves? Recommendation: optimistic with rollback on failure for snappier UX.

Tech Lead note for `@dev`:
- Reuse Feature 05 storage service boundaries instead of introducing a new storage path.
- Keep Portuguese-first labels consistent with existing terminology: `Favoritas`, `Salvar nos Favoritos`, `Remover dos Favoritos`.

## QA Analysis - 2026-05-02

Coverage assessment:
The feature is testable and now has sufficient technical direction, but QA must lock expected behaviors for toggle latency, storage failure handling, and cross-tab consistency.

Test strategy:
- Prioritize unit tests at the storage boundary for deterministic favorite state transitions.
- Add component tests for History/Result/Favorites interactions and Portuguese copy.
- Add integration tests that validate persistence across reload/re-mount cycles.

Acceptance criteria:
- Toggling favorite from History marks the story as favorited and immediately includes it in Favorites.
- Toggling favorite off from Favorites removes it from Favorites without deleting it from History.
- Toggling favorite from Result updates the same stored story entity by `id`.
- `favorite` updates must preserve `createdAt`, `promptVersion`, story content, and params.
- On storage write failure, UI shows retryable Portuguese feedback and does not corrupt list state.
- Favorites persist after page reload via storage re-read.

Automation candidates:
- Unit test `toggleFavorite(storyId, nextFavorite?)` sets `favorite` and updates `updatedAt` only.
- Unit test default toggle behavior (no `nextFavorite`) flips current boolean.
- Unit test missing `storyId` returns typed no-op and leaves storage unchanged.
- Unit test repeated fast toggles while in-flight are blocked or coalesced per decided rule.
- Component test History card action label/icon switches between save/remove favorite states.
- Component test Favorites screen renders only `favorite === true` rows and Portuguese empty state.
- Component test unfavorite action in Favorites removes the row from that view but not from History.
- Component test Result action writes favorite state for the generated/persisted story.
- Integration test remount/reload retains favorite state from local storage.
- Integration test storage failure path rolls back optimistic UI (if optimistic mode is adopted).

Manual test scenarios:
1. Favorite in History, switch to Favorites, confirm item appears once and with correct label.
2. Unfavorite in Favorites, switch to History, confirm story remains available and unfavorited.
3. Favorite from Result right after generation, then open History/Favorites and confirm consistency.
4. Reload browser tab and confirm previously favorited stories remain in Favorites.
5. Simulate storage failure and confirm Portuguese error feedback plus recoverable retry behavior.

Regression focus:
- Feature 03 generation/persistence flow must remain intact when favorite toggling is introduced.
- Feature 05 local library ordering and story identity (`id`) must not change unexpectedly.
- No duplicate records may be created by favoriting/unfavoriting operations.

QA exit criteria:
- All new favorite-related unit/component/integration tests pass in the default frontend test command.
- Manual checks confirm parity across mobile and desktop for History/Favorites/Result favorite actions.

## Tech Lead Implementation Readiness Addendum - 2026-05-02

Technical approach:
Build Favorites as a storage-backed projection over the existing local story library. Extend the `SavedStory` contract with a persisted `favorite: boolean` value defaulting to `false` for older records, expose a single `toggleFavorite(storyId, nextFavorite?)` storage operation, and have History, Result, Reader, and Favorites consume the same story state source. Do not create a separate favorites collection.

Affected areas:
- Frontend story domain/entity types.
- Local story storage adapter and migrations/default normalization.
- History story cards and item actions.
- Result/reader story actions.
- Navigation/tab shell for the Favorites section.
- Frontend unit, component, and persistence integration tests.

Dependencies:
- Feature 03 must assign a stable story `id` before Result actions can target persistence.
- Feature 05 must provide the local story storage boundary and IndexedDB-backed saved story list.
- If older saved records exist without `favorite`, read normalization must treat them as `favorite: false` without destructive migration.
- Favorite labels and empty states must stay Portuguese-first.

Data flow:
1. UI receives a `SavedStory` from the local library state.
2. Favorite action calls `toggleFavorite(story.id, nextFavorite?)`.
3. Storage updates only `favorite` and `updatedAt` for that `id`.
4. App re-reads or reconciles the updated story into the canonical saved-story list.
5. History renders all stories; Favorites renders `stories.filter((story) => story.favorite)`.

Engineering tasks:
- [ ] Add or confirm `favorite: boolean` on `SavedStory` with default normalization for legacy records.
- [ ] Implement `toggleFavorite(storyId: string, nextFavorite?: boolean)` in the existing story storage service.
- [ ] Return a typed result for success, missing story, and persistence failure; avoid throwing into UI components for expected cases.
- [ ] Add per-story in-flight state so rapid repeated taps cannot race and produce stale favorite state.
- [ ] Add reusable favorite action UI with accessible labels for favorited and non-favorited states.
- [ ] Wire favorite action into History cards without changing History membership or sort behavior.
- [ ] Wire favorite action into persisted Result/reader stories, hiding or disabling it when no persisted story `id` exists.
- [ ] Add the Favorites section as a filtered view with Portuguese empty state copy.
- [ ] Ensure unfavorite from Favorites removes the item from the Favorites projection but leaves it visible in History.

Testing notes:
- Storage tests should assert only `favorite` and `updatedAt` change during toggle.
- Component tests should cover History, Favorites, and Result/reader entry points using the same mocked storage state.
- Persistence tests should verify favorites survive reload/remount and legacy records without `favorite` still render safely.
- Accessibility tests or assertions should cover button labels/state for screen readers, not just icon changes.

Risks:
- A separate favorites store would introduce drift and duplicate/deleted records; keep a single source of truth.
- Optimistic UI without rollback can corrupt perceived state on storage failure; implement rollback or confirmed-write state deliberately.
- Result favorite action can fail if generation persistence is non-blocking; only enable it when a storage-resolvable `id` exists.

Open technical questions:
- Final icon choice remains a product/UI decision: star and heart are both viable, but the implementation must not rely on icon-only meaning.
- Confirm whether Favorites should inherit History ordering (`createdAt` newest first) or sort by most recently favorited (`updatedAt` newest first). Recommendation for MVP: inherit History ordering to avoid surprising list movement after unrelated edits.
