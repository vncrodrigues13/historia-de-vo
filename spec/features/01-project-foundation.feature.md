# Feature: Project Foundation

Goal:
Create the first web app structure for the local MVP.

User value:
The parent can open one simple app and move between the main sections without setup confusion.

Priority:
Must have.

Development area:
Shared. This feature creates the `frontend/` app base, the `backend/` API base, environment examples, layout shell, and domain types used by each side.

## User Flow

1. The parent opens the app in the browser.
2. The app shows tabs for Create, History, Favorites, and Settings.
3. The parent can switch sections without losing the current story state.

## Requirements

- Use TypeScript for both frontend and backend projects.
- Use `npm` as the canonical package manager.
- Keep `frontend/` and `backend/` as completely independent projects, each with its own workspace and configuration.
- Use Next.js with TypeScript for the frontend app.
- Use NestJS with TypeScript for the backend API.
- Use Jest for tests and ESLint for linting.
- Target the latest Node.js LTS line, Node.js 24.x.
- Use English for the initial UI copy.
- Add project scripts for dev, test, build, and lint in the relevant project folders.
- Add `backend/.env.example` for server-side provider configuration.
- Use OpenAI API as the first LLM provider.
- Do not implement TTS in this foundation feature; the first implementation should generate text output only.
- Create the base domain types from `project-kickoff.md` for stories, settings, voices, and timers inside the project that uses them.
- Keep the first layout as one responsive page with internal tabs.
- Preserve the generated story state when switching between tabs.
- Expose a backend health route at `/health`.

## Implementation Plan

1. Scaffold the frontend app in `frontend/`.
2. Scaffold the backend API in `backend/`.
3. Add configuration and scripts in each project.
4. Create the main frontend tab layout.
5. Add domain/request types where each project needs them.
6. Add placeholder sections for the first MVP screens.

## Tech Lead Overview

Technical approach:
Create two independent TypeScript app foundations with clear runtime boundaries: the browser app in `frontend/` and the API app in `backend/`. Keep provider credentials and provider calls server-side only. For the first implementation, prefer simple local development commands and avoid a shared package until frontend/backend contracts stabilize; duplicate only the small request/response/domain types each side actually needs.

Affected areas:
Repository configuration, `frontend/` app shell, `backend/` API shell, environment examples, local scripts, and initial type definitions.

Dependencies:
- Package manager and app frameworks are selected: npm, Next.js frontend, NestJS backend.
- Frontend should include a test runner, linter, and build command from the start.
- Backend should include TypeScript runtime/build tooling, request validation, Jest tests, and ESLint.
- `backend/.env.example` should document required backend-only provider keys without real values.
- TTS provider selection is deferred and should not block the text-generation foundation.

Engineering tasks:
- [x] Select and document the package manager plus frontend/backend framework choices.
- [x] Add root-level setup notes that point to the frontend and backend commands.
- [x] Scaffold `frontend/` with responsive tab shell state for Create, History, Favorites, and Settings.
- [x] Scaffold `backend/` with NestJS, a `/health` route, and a clear place for future provider adapters.
- [x] Add environment loading on the backend and keep frontend configuration free of API secrets.
- [x] Define minimal story, settings, voice, timer, and request/response types in the projects that consume them.
- [x] Add baseline tests that verify the frontend shell renders and the backend health route responds.

Testing notes:
Validate that both apps build, lint, and test independently. The frontend test should assert all four MVP tabs are present and tab switching preserves shell state. The backend test should assert the health route works without provider credentials.

Risks:
- Unresolved framework/package-manager choices can create avoidable churn during the first scaffold.
- Duplicating types locally is acceptable for the MVP, but request/response contracts should be reviewed before generation and narration features depend on them.
- Frontend environment handling must not accidentally expose LLM or TTS provider keys.

Open technical questions:
- Decision: `backend/.env.example` includes only current OpenAI/LLM variables; deferred TTS placeholders were omitted for this foundation feature.

## TODO

- [x] Create the frontend TypeScript scaffold in `frontend/`.
- [x] Create the backend TypeScript scaffold in `backend/`.
- [x] Add `dev`, `test`, `build`, and `lint` scripts for each project.
- [x] Add `backend/.env.example`.
- [x] Create frontend story types where the UI needs them.
- [x] Create backend story request and response types where the API needs them.
- [x] Build the tab navigation shell.

## Acceptance Seeds

- The app starts locally with the documented dev command.
- The four MVP sections are visible.
- No API key is exposed in client-side code.

## Open Questions

- Decision: deferred TTS placeholders are omitted until a TTS provider is selected.

## Out of Scope

- User accounts.
- Cloud sync.
- Multiple routes for individual stories.
