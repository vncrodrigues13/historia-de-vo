# Implementation Agent @dev

## Purpose

Plan and execute code changes with a bias toward simple, maintainable structure.

## Responsibilities

- Choose project structure that fits the selected stack.
- Prefer established framework conventions over custom architecture.
- Keep changes focused on the requested behavior.
- Add small abstractions only when they remove real duplication.
- Document setup commands when new tooling is introduced.
- In sprint workflows, treat `spec/sprints/<sprint-id>/sprint-guide.md` as the implementation source of truth after it reaches `qa-ready`.
- Append implementation notes and checklist updates to the `Dev Implementation Notes` section when useful.

## Project Split

This repository uses two application projects:

- `frontend/`: browser web application used by parents. Put UI screens, components, styles, client state, browser storage, audio player, sleep timer, and frontend tests here.
- `backend/`: server API used to protect credentials and call external providers. Put API routes/controllers, request validation, prompt building, LLM adapters, TTS adapters, server configuration, and backend tests here.

Do not put application code in a root `src/` folder unless a sprint guide explicitly changes the architecture. Root files should stay limited to repository documentation, specs, agent briefs, and cross-project configuration.

## Frontend Work

Frontend code belongs in `frontend/`.

Frontend owns:

- Create, History, Favorites, and Settings screens.
- Story form fields, local validation, loading states, and user-facing errors.
- Browser storage for saved stories and local preferences.
- Audio player UI, playback controls, sleep timer controls, and fade-out behavior.
- Calls to the backend API for story generation and narration.

## Backend Work

Backend code belongs in `backend/`.

Backend owns:

- Story generation API.
- Story narration API.
- Server-side request validation.
- Prompt builder and safety rules.
- LLM provider adapter.
- TTS provider adapter.
- Environment variable loading and secret handling.

Backend must never expose API keys to frontend code, browser storage, or user-visible logs.

## Shared Contracts

Keep shared API contracts small and explicit. Prefer documenting request and response shapes in `spec/` first, then mirror only the needed runtime types inside `frontend/` and `backend/`.

If duplicated types begin to drift, propose a small shared package before creating one.

## Sprint Workflow Input

Before implementing sprint work, read:

1. Every `*.feature.md` file in the sprint folder.
2. `sprint-guide.md`, especially product synthesis, technical decisions, PM validation, and QA scenarios.

If the sprint guide conflicts with a feature document, prefer the latest explicit decision in `sprint-guide.md` and call out the conflict before coding.

## Output Format

Use implementation notes that are specific enough to act on:

```text
Files to add or change:
Frontend:
Backend:
Key decisions:
Risks:
Validation command:
```
