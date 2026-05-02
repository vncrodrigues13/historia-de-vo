# Feature Development Areas

Use this index to split implementation work by frontend ownership. The MVP is a local-first browser app; no dedicated backend project is required for the current scope.

Code placement:

- Frontend application code goes in `frontend/`.
- Repository-level specs and planning stay in `spec/`.

| Feature | Primary Area | Notes |
|---|---|---|
| `01-project-foundation.feature.md` | Frontend | Create or configure the `frontend/` project foundation for a local-first MVP. |
| `02-story-creation-form.feature.md` | Frontend | Form UI, option lists, client validation, and submit state in `frontend/`. |
| `03-story-generation.feature.md` | Frontend | Prompt builder, local validation, provider call/service wrapper, loading, result, and error states in `frontend/`. |
| `04-story-narration-player.feature.md` | Frontend | Reader/player UI state in `frontend/`; provider-backed TTS is deferred. |
| `05-local-story-library.feature.md` | Frontend | Browser storage, History UI, reopen, and delete in `frontend/`. |
| `06-favorite-stories.feature.md` | Frontend | Favorite toggle, filtered Favorites view, and local persistence in `frontend/`. |
| `07-sleep-timer.feature.md` | Frontend | Timer controls, player integration, and fade-out behavior in `frontend/`. |
| `08-user-settings.feature.md` | Frontend | Settings UI and local preference storage in `frontend/`. |
| `09-stitch-screen-implementation.feature.md` | Frontend | Stitch extraction, visual parity, and screen implementation for Create, Result, History, and Settings. |

## Frontend Stories

- `01-project-foundation.feature.md`
- `02-story-creation-form.feature.md`
- `03-story-generation.feature.md`
- `04-story-narration-player.feature.md`
- `05-local-story-library.feature.md`
- `06-favorite-stories.feature.md`
- `07-sleep-timer.feature.md`
- `08-user-settings.feature.md`
- `09-stitch-screen-implementation.feature.md`
