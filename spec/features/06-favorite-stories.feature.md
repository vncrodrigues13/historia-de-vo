# Feature: Favorite Stories

Goal:
Let the parent mark useful stories as favorites.

User value:
The parent can quickly find stories the child likes.

Priority:
Should have for MVP validation.

Development area:
Frontend. This feature updates local story records and renders the Favorites view.

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
