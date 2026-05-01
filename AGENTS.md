# Repository Guidelines

## Project Structure & Module Organization

This is a brand new project. Keep the layout predictable as the codebase grows. The repository is split into two application projects:

- `frontend/`: browser web application.
- `backend/`: server API for provider calls, validation, and secrets.

Put frontend application code in `frontend/` and backend application code in `backend/`. Keep tests in each project, either in `tests/` or next to source files as `*.test.*`. Static frontend assets belong in `frontend/assets/` or `frontend/public/` depending on the framework. Keep repository-level configuration and documentation at the repository root.

Recommended starting layout:

```text
frontend/   browser application code, frontend tests, and frontend assets
backend/    server API code, backend tests, and backend configuration
spec/       feature and sprint specifications
.agents/    project-specific agent role briefs
```

## Project Agents

Use the role briefs in `.agents/` when work benefits from focused review:

- `.agents/product.md`: clarifies user goals, content flows, and scope.
- `.agents/tech-lead.md`: turns stories into technical overviews and implementation task definitions.
- `.agents/implementation.md`: plans code structure and implementation details.
- `.agents/qa.md`: checks acceptance criteria, tests, edge cases, and regressions.

Keep these briefs short and update them as the product direction becomes clearer.

## Sprint Workflow

Sprint packages live in `spec/sprints/<sprint-id>/`. Each sprint folder contains all feature documents for that sprint plus one consolidated `sprint-guide.md`.

Use this automatic order when asked to run a sprint workflow:

1. `@pm` reads all sprint feature documents and writes `PM Product Synthesis`.
2. `@tl` reads the guide and appends `Tech Lead Implementation Decisions`.
3. `@pm` validates the guide and appends `PM Validation`.
4. `@qa` appends `QA Test Scenarios`.
5. `@dev` uses the final guide for implementation and may append `Dev Implementation Notes`.

See `spec/sprints/README.md` and `spec/sprints/_sprint-guide-template.md` for the required file structure.

## Build, Test, and Development Commands

No build system is configured yet. When a stack is selected, document the canonical commands here and prefer package scripts or task aliases over long one-off commands.

Common examples:

```bash
npm run dev      # start a local development server
npm test         # run the test suite
npm run build    # create a production build
```

## Coding Style & Naming Conventions

Use clear, descriptive names and focused files. Prefer `kebab-case` for web filenames, `snake_case` for Python modules, and `PascalCase` for exported UI components or classes. Use 2 spaces for JavaScript, TypeScript, JSON, YAML, and CSS; use 4 spaces for Python.

Add a formatter early, such as Prettier, Ruff, Black, or the framework default. Do not mix unrelated formatting churn with feature work.

## Testing Guidelines

Add tests with meaningful behavior changes. Name tests after the behavior being verified, such as `story-editor.test.ts` or `test_story_generation.py`. Once a runner is chosen, make one command the default way to run all tests locally.

## Commit & Pull Request Guidelines

There is no git history yet, so use concise, imperative commit messages such as `Add story editor scaffold` or `Document local setup`. Pull requests should include a summary, test results, linked issues when relevant, and screenshots or recordings for UI changes.

## Security & Configuration Tips

Never commit secrets or local credentials. Provide `.env.example` for required configuration keys and document safe defaults.
