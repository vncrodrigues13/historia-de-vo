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
