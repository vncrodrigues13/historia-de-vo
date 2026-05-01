# Sprint Workflow

Use this folder for sprint packages. Each sprint owns its feature documents and one generated implementation guide that agents append to in a fixed order.

## Sprint Layout

```text
spec/sprints/
  sprint-001/
    01-feature-name.feature.md
    02-feature-name.feature.md
    03-feature-name.feature.md
    sprint-guide.md
```

Feature documents stay inside the sprint folder so the sprint is self-contained. Use numeric prefixes to make priority and reading order explicit.

## Automatic Agent Order

When asked to run the sprint workflow for `spec/sprints/<sprint-id>/`, execute these steps in order:

1. `@pm` reads every `*.feature.md` file in the sprint folder and creates or updates `sprint-guide.md`.
2. `@tl` reads `sprint-guide.md` and appends technical decisions, dependencies, risks, and implementation tasks.
3. `@pm` reads the updated `sprint-guide.md` and appends product validation, scope corrections, and final open questions.
4. `@qa` reads the validated `sprint-guide.md` and appends acceptance criteria, test scenarios, regression checks, and manual checks.
5. `@dev` uses the final `sprint-guide.md` as the implementation source of truth.

Do not let later agents rewrite earlier sections unless the user explicitly asks. Later agents should append corrections, decisions, and questions under their own section.

## Required Sprint Guide Sections

`sprint-guide.md` must use this structure:

```text
# Sprint Guide: <Sprint Name>

Sprint folder:
Status:
Source feature documents:

## PM Product Synthesis

## Tech Lead Implementation Decisions

## PM Validation

## QA Test Scenarios

## Dev Implementation Notes
```

## Status Values

- `draft`: feature documents are still being prepared.
- `pm-synthesized`: `@pm` created the initial synthesis.
- `tl-reviewed`: `@tl` appended technical decisions.
- `pm-validated`: `@pm` validated the technical plan.
- `qa-ready`: `@qa` appended scenarios and checks.
- `in-development`: `@dev` started implementation.
- `done`: implementation and validation are complete.

## Feature Document Template

```text
# Feature: <Feature Name>

Goal:
User value:
Priority:

## User Flow

1. 

## Requirements

- 

## Acceptance Seeds

- 

## Open Questions

- 

## Out of Scope

- 
```
