# Feature: Project Foundation

Goal:
Create the first web app structure for the local MVP.

User value:
The parent can open one simple app and move between the main sections without setup confusion.

Priority:
Must have.

Development area:
Frontend. This feature creates the `frontend/` app base, local environment examples, layout shell, and domain types used by the browser app.

Asset fallback policy:
If any later feature needs Stitch reference assets and the Stitch MCP fetch is unavailable, use the checked-in files under `external-assets/stitch/stitch_contos_de_ninar_control_panel/` as the fallback source instead of blocking frontend work.

## User Flow

1. The parent opens the app in the browser.
2. The app shows tabs for Create, History, Favorites, and Settings.
3. The parent can switch sections without losing the current story state.

## Requirements

- Use TypeScript for the frontend project.
- Use `npm` as the canonical package manager.
- Use Next.js with TypeScript for the frontend app.
- Use Jest for tests and ESLint for linting.
- Target the latest Node.js LTS line, Node.js 24.x.
- Use English for the initial UI copy.
- Add project scripts for dev, test, build, and lint in `frontend/`.
- Add `frontend/.env.example` for local-only provider configuration used during prototyping.
- Use OpenAI API as the first LLM provider during local testing.
- Do not implement provider-backed TTS in this foundation feature; the first implementation should generate text output only.
- Create the base domain types from `project-kickoff.md` for stories, settings, and timers inside the project that uses them.
- Keep the first layout as one responsive page with internal tabs.
- Preserve the generated story state when switching between tabs.
- Foundation docs and folder conventions should allow frontend teams to import checked-in fallback assets from `external-assets/` when Stitch MCP export is unavailable.

## Implementation Plan

1. Scaffold the frontend app in `frontend/`.
2. Add frontend configuration and scripts.
3. Create the main frontend tab layout.
4. Add domain/request types where the frontend needs them.
5. Add placeholder sections for the first MVP screens.

## Tech Lead Overview

Technical approach:
Create a single TypeScript frontend foundation for a local-first MVP. Keep provider integration behind frontend service modules so UI components do not call providers directly. For the first implementation, prefer simple local development commands and avoid a dedicated backend until the product needs TTS, remote persistence, user accounts, or public deployment.

Affected areas:
Repository configuration, `frontend/` app shell, local environment examples, frontend scripts, and initial type definitions.

Dependencies:
- Package manager and app framework are selected: npm and Next.js frontend.
- Frontend should include a test runner, linter, and build command from the start.
- `frontend/.env.example` should document local-only provider keys without real values.
- TTS provider selection and backend architecture are deferred and should not block the text-generation foundation.

Engineering tasks:
- [x] Select and document the package manager plus frontend framework choice.
- [x] Add root-level setup notes that point to the frontend commands.
- [x] Scaffold `frontend/` with responsive tab shell state for Create, History, Favorites, and Settings.
- [x] Remove the dedicated `backend/` requirement from the MVP architecture documentation.
- [ ] Add local environment documentation for frontend-only provider testing.
- [x] Define minimal story, settings, timer, and request/response types in the frontend.
- [x] Add baseline tests that verify the frontend shell renders.

Testing notes:
Validate that the frontend builds, lints, and tests independently. The frontend test should assert all four MVP tabs are present and tab switching preserves shell state.

Risks:
- Unresolved framework/package-manager choices can create avoidable churn during the first scaffold.
- Calling an LLM from local frontend code is acceptable only for local testing; revisit this before public deployment.
- Provider-specific code should stay isolated from React components so a backend can be introduced later without a UI rewrite.

Open technical questions:
- Decision: the MVP does not require a dedicated backend while it remains local-only and text-generation focused.

## TODO

- [x] Create the frontend TypeScript scaffold in `frontend/`.
- [x] Add `dev`, `test`, `build`, and `lint` scripts for the frontend project.
- [ ] Add `frontend/.env.example`.
- [x] Create frontend story types where the UI needs them.
- [x] Build the tab navigation shell.

## Acceptance Seeds

- The app starts locally with the documented dev command.
- The four MVP sections are visible.
- Local provider configuration is documented for prototype-only use.

## Open Questions

- Decision: deferred TTS and backend placeholders are omitted until those capabilities are selected.

## Out of Scope

- User accounts.
- Cloud sync.
- Multiple routes for individual stories.
