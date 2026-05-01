# Feature Development Areas

Use this index to split implementation work by frontend and backend ownership.

Code placement:

- Frontend application code goes in `frontend/`.
- Backend application code goes in `backend/`.
- Repository-level specs and planning stay in `spec/`.

| Feature | Primary Area | Notes |
|---|---|---|
| `01-project-foundation.feature.md` | Shared | Create or configure both `frontend/` and `backend/` project foundations. |
| `02-story-creation-form.feature.md` | Frontend | Form UI, option lists, client validation, and submit state in `frontend/`. |
| `03-story-generation.feature.md` | Backend | API route, prompt builder, LLM adapter, and server validation in `backend/`; frontend result states in `frontend/`. |
| `04-story-narration-player.feature.md` | Full stack | TTS API and adapter in `backend/`; browser audio player controls in `frontend/`. |
| `05-local-story-library.feature.md` | Frontend | Browser storage, History UI, reopen, and delete in `frontend/`. |
| `06-favorite-stories.feature.md` | Frontend | Favorite toggle, filtered Favorites view, and local persistence in `frontend/`. |
| `07-sleep-timer.feature.md` | Frontend | Timer controls, player integration, and fade-out behavior in `frontend/`. |
| `08-user-settings.feature.md` | Frontend | Settings UI and local preference storage in `frontend/`. |

## Backend Stories

- `03-story-generation.feature.md`
- Backend portion of `04-story-narration-player.feature.md`

## Frontend Stories

- `02-story-creation-form.feature.md`
- Frontend portion of `04-story-narration-player.feature.md`
- `05-local-story-library.feature.md`
- `06-favorite-stories.feature.md`
- `07-sleep-timer.feature.md`
- `08-user-settings.feature.md`

## Shared Stories

- `01-project-foundation.feature.md`
