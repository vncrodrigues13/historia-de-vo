# Feature: Local Story Library

Goal:
Save generated stories in the browser and let the parent reopen them.

User value:
The parent can reuse stories without generating them again.

Priority:
Must have.

Development area:
Frontend. This feature uses browser storage and UI screens only; no server API is required for the MVP.

## User Flow

1. A generated story is saved automatically.
2. The parent opens History.
3. The parent sees saved stories newest first.
4. The parent opens one story and can narrate it again.
5. The parent can delete a story after confirmation.

## Requirements

- Store stories locally in IndexedDB.
- Save story text, parameters, voice, speed, favorite flag, and timestamps.
- Do not store audio in the MVP.
- List stories in reverse chronological order.
- Confirm before deleting.

## Implementation Plan

1. Create browser storage service.
2. Save generated stories automatically.
3. Build the History list.
4. Open a saved story in the reader.
5. Add delete with confirmation.

## TODO

- [ ] Implement `story-storage`.
- [ ] Save generated stories.
- [ ] Create History section.
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
- Audio file storage.
- Sharing stories.
