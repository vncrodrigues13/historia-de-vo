# Feature: Stitch Screen Implementation

Goal:
Implement the production UI from the Stitch project screens as the source of truth for the first usable control panel.

User value:
The parent sees a cohesive Portuguese bedtime story control panel with the same Create, Result, History, and Settings flows defined in design.

Priority:
Must have for UI parity.

Development area:
Frontend. This feature coordinates screen extraction, local asset storage, visual implementation, and handoff into the existing feature areas.

## Stitch Source

Project:
Contos de Ninar Control Panel

Project ID:
`15204996058292121576`

Screens:

| Screen | Screen ID | Feature owner |
|---|---|---|
| Criar História (Restaurada) | `8a422bd8840044ab9b40c7f313011b02` | `02-story-creation-form.feature.md` |
| Resultado da História | `2f52b97627124271b828d2781e99ae86` | `03-story-generation.feature.md`, `04-story-narration-player.feature.md` |
| Histórico de Histórias | `b610fe1a118c47e9a25a537c1d1e6230` | `05-local-story-library.feature.md` |
| Configurações 2 | `ce4a28b488d7451e90827057767e6fb9` | `08-user-settings.feature.md` |

## Extraction Commands

Use the Stitch screen export output to fill the hosted URLs, then download each screen image and code snapshot into the repo.

```bash
mkdir -p frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02
curl -L "$CRIAR_HISTORIA_IMAGE_URL" -o frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/screen.png
curl -L "$CRIAR_HISTORIA_CODE_URL" -o frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/stitch-code.html

mkdir -p frontend/assets/stitch/2f52b97627124271b828d2781e99ae86
curl -L "$RESULTADO_HISTORIA_IMAGE_URL" -o frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/screen.png
curl -L "$RESULTADO_HISTORIA_CODE_URL" -o frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/stitch-code.html

mkdir -p frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230
curl -L "$HISTORICO_HISTORIAS_IMAGE_URL" -o frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/screen.png
curl -L "$HISTORICO_HISTORIAS_CODE_URL" -o frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/stitch-code.html

mkdir -p frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9
curl -L "$CONFIGURACOES_2_IMAGE_URL" -o frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/screen.png
curl -L "$CONFIGURACOES_2_CODE_URL" -o frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/stitch-code.html
```

The Stitch MCP call returned `Auth required` during PM spec work, so the hosted URLs still need to be copied from an authenticated Stitch export before these commands can run.

## User Flow

1. The parent lands on the Create screen in Portuguese.
2. The parent configures and generates a bedtime story.
3. The app navigates to the Result screen with story text and reader actions.
4. Generated stories persist into History.
5. The parent can adjust defaults in Settings and return to Create with those defaults applied.

## Requirements

- Treat Stitch as the visual source of truth for layout, spacing, labels, color, and component hierarchy.
- Implement the four screens as real Next.js UI states, not static screenshots.
- Keep the app Portuguese-first for user-facing copy.
- Reuse shared shell, navigation, form controls, list items, and action buttons where the Stitch screens share patterns.
- Store extracted Stitch reference files under `frontend/assets/stitch/<screen-id>/`.
- Do not commit temporary download URLs, tokens, or credentials.

## Implementation Plan

1. Download the four Stitch images and code snapshots into `frontend/assets/stitch/`.
2. Compare the current UI against each Stitch screen and identify shared layout primitives.
3. Update the app shell and navigation to match the control panel frame.
4. Implement Create, Result, History, and Settings screen states from the Stitch references.
5. Add responsive checks for mobile and desktop breakpoints.
6. Add or update frontend tests for screen rendering, tab navigation, and required interactions.

## TODO

- [ ] Download Stitch image and code exports for all four screens.
- [ ] Add extracted files under `frontend/assets/stitch/<screen-id>/`.
- [ ] Update shared app shell to match the Stitch control panel.
- [ ] Implement `Criar História (Restaurada)` in the Create flow.
- [ ] Implement `Resultado da História` in the generated story result flow.
- [ ] Implement `Histórico de Histórias` in the History flow.
- [ ] Implement `Configurações 2` in the Settings flow.
- [ ] Verify responsive layout against the Stitch references.
- [ ] Add frontend tests for screen navigation and core interactions.

## Acceptance Seeds

- Each Stitch screen has a local `screen.png` and `stitch-code.html` reference file.
- The app opens on the Create screen and visually matches `Criar História (Restaurada)`.
- A generated story state shows the Result screen instead of remaining on the form.
- History and Settings screens match their Stitch references and keep functional local state.
- User-facing copy is Portuguese-first across the implemented screens.

## Open Questions

- Are the Stitch exports intended to replace the existing tab shell labels with Portuguese labels everywhere?
- Should the Result screen include real playback controls in MVP or reader-only controls until narration is implemented?
- Should the implementation preserve the exact Stitch HTML structure or translate it into project-native React components?

## Out of Scope

- Backend provider integration beyond existing story generation scope.
- Account login or cloud sync.
- Design changes outside the four provided screens.
