# Feature: Local Story Library

Goal:
Save generated stories in the browser and let the parent reopen them.

User value:
The parent can reuse stories without generating them again.

Priority:
Must have.

Development area:
Frontend. This feature uses browser storage and UI screens only.

Stitch screen:
`Histórico de Histórias` from project `15204996058292121576`, screen `b610fe1a118c47e9a25a537c1d1e6230`.

## User Flow

1. A generated story is saved automatically.
2. The parent opens History.
3. The parent sees saved stories newest first.
4. The parent opens one story in the reader.
5. The parent can delete a story after confirmation.

## Requirements

- Store stories locally in IndexedDB.
- Save story text, parameters, favorite flag, and timestamps.
- List stories in reverse chronological order.
- Confirm before deleting.
- History screen should match the extracted Stitch list layout, empty state, and story item actions.
- History copy and dates should be Portuguese-first.

## Implementation Plan

1. Extract the Stitch image and code reference for `Histórico de Histórias`.
2. Create browser storage service.
3. Save generated stories automatically.
4. Build the History list to match the Stitch reference.
5. Open a saved story in the reader.
6. Add delete with confirmation.

## TODO

- [ ] Download `Histórico de Histórias` Stitch references into `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/`.
- [ ] Implement `story-storage`.
- [ ] Save generated stories.
- [ ] Create History section.
- [ ] Match the Stitch History screen layout, item states, and actions.
- [ ] Open saved story in reader.
- [ ] Delete story by id after confirmation.
- [ ] Handle storage unavailable errors.

## Acceptance Seeds

- A new generated story appears in History.
- History sorts newest first.
- Opening a saved story shows the full text.
- Deleted stories disappear and do not return on reload.

## Open Questions

- Is IndexedDB required from the first implementation, or can a temporary localStorage adapter start the MVP?

## Out of Scope

- Cloud backup.
- Sharing stories.
