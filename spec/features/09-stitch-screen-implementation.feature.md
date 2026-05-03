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

## Asset Fallback Source

If the Stitch MCP fetch/export is unavailable, use the checked-in `external-assets/` folders as the source of truth for screen image/code references. Each fallback folder contains `screen.png` and `code.html`; copy `code.html` into the app assets as `stitch-code.html`.

| Screen | Fallback source files | Target folder |
|---|---|---|
| Criar História (Restaurada) | `external-assets/stitch/stitch_contos_de_ninar_control_panel/criar_hist_ria_restaurada/screen.png`, `external-assets/stitch/stitch_contos_de_ninar_control_panel/criar_hist_ria_restaurada/code.html` | `frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/` |
| Resultado da História | `external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/screen.png`, `external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/code.html` | `frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/` |
| Histórico de Histórias | `external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/screen.png`, `external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/code.html` | `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/` |
| Configurações 2 | `external-assets/stitch/stitch_contos_de_ninar_control_panel/configura_es_2/screen.png`, `external-assets/stitch/stitch_contos_de_ninar_control_panel/configura_es_2/code.html` | `frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/` |

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
If that authenticated export remains unavailable, implementation should continue from the checked-in `external-assets/` fallback rather than blocking screen work.

Fallback import commands:

```bash
mkdir -p frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/criar_hist_ria_restaurada/screen.png frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/screen.png
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/criar_hist_ria_restaurada/code.html frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/stitch-code.html

mkdir -p frontend/assets/stitch/2f52b97627124271b828d2781e99ae86
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/screen.png frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/screen.png
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/resultado_da_hist_ria/code.html frontend/assets/stitch/2f52b97627124271b828d2781e99ae86/stitch-code.html

mkdir -p frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/screen.png frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/screen.png
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/code.html frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/stitch-code.html

mkdir -p frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/configura_es_2/screen.png frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/screen.png
cp external-assets/stitch/stitch_contos_de_ninar_control_panel/configura_es_2/code.html frontend/assets/stitch/ce4a28b488d7451e90827057767e6fb9/stitch-code.html
```

## User Flow

1. The parent lands on the Create screen in Portuguese.
2. The parent configures and generates a bedtime story.
3. The app navigates to the Result screen with story text and reader actions.
4. Generated stories persist into History.
5. The parent can adjust defaults in Settings and return to Create with those defaults applied.

## Requirements

- Treat Stitch as the visual source of truth for layout, spacing, labels, color, and component hierarchy.
- If Stitch MCP export is unavailable, treat the checked-in `external-assets/` copies as the working source of truth for those same screens.
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

## Demand Validation - Tech Lead - 2026-05-02

Verdict:
Valid and necessary. Feature 09 should remain a cross-screen UI parity feature because the current app already has separate feature ownership for behavior. This demand should not reopen generation, storage, favorites, settings, or narration scope except where shared UI composition requires integration adjustments.

Implementation readiness:
- Ready to start from local reference assets. The Stitch MCP auth issue is not a blocker because `external-assets/stitch/stitch_contos_de_ninar_control_panel/` contains all four fallback `screen.png` and `code.html` pairs.
- Local imported assets currently exist for Create, Result, and Settings. History still needs to be copied into `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/` before History parity work is closed.
- Feature 09 should use the project-native Next.js/React components as the implementation target. The exported Stitch HTML is a reference for visual and structural intent, not production component code to paste wholesale.

Tech Lead Overview:
Technical approach:
Establish one shared Stitch-aligned application shell first, then implement each screen as a real state inside that shell. Keep behavior contracts owned by their feature specs: Create owns validation and typed `StoryParams`, Generation owns Create-to-Result lifecycle, History owns saved-story list actions, Settings owns local preferences. Use the Stitch references to extract reusable visual primitives such as header navigation, page background, content width, section grouping, chip/segmented controls, story cards, reader actions, empty states, and feedback messages.

Affected areas:
`frontend/src/components/tab-shell.tsx`, `frontend/src/components/create-tab.tsx`, `frontend/src/components/story-result.tsx`, `frontend/src/components/history-tab.tsx`, `frontend/src/components/settings-tab.tsx`, shared CSS in `frontend/app/globals.css`, Stitch reference assets in `frontend/assets/stitch/`, and frontend component tests that cover navigation plus core screen interactions.

Data flow:
Create submits validated `StoryParams` to the generation service boundary. Successful generation stores a `GeneratedStory`, renders Result in the same shell, and hands the story to persistence. History reads saved stories from the persistence boundary and opens/toggles/deletes by story id. Settings loads and saves `UserSettings`, then applies defaults only to new story drafts. Feature 09 must preserve that flow while replacing presentation.

Dependencies:
- Feature 02 form behavior and validation must remain intact while replacing dropdown-style controls with Stitch-aligned chip/segmented controls where applicable.
- Feature 03 must provide a generated-story Result state, even if the provider remains deterministic/local for MVP.
- Feature 05 must expose saved-story list data and actions for History parity.
- Feature 08 settings storage and defaults must remain the source for Settings controls.
- Feature 06 Favorites affects visible favorite actions in Result and History, but Feature 09 should only align those actions visually.

Engineering tasks:
- [ ] Copy the History fallback reference from `external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/screen.png` into `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/screen.png`.
- [ ] Copy the History fallback code from `external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/code.html` into `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/stitch-code.html`.
- [ ] Add a short `EXTERNAL_ASSETS.md` note for any imported fallback asset folder that does not already document its source.
- [ ] Define shared shell primitives for the warm background, top navigation, mobile navigation, content container, decorative layer, and status/warning placement.
- [ ] Define shared control primitives for icon buttons, primary actions, chip groups, segmented controls, section headers, and form/list feedback states.
- [ ] Align Create with the Stitch reference without changing `validateStoryParams`, submitted enum values, loading state, or error behavior.
- [ ] Align Result with the Stitch reference while preserving generated title/text, estimated minutes, favorite action, create-another action, and storage warning behavior.
- [ ] Align History with the Stitch reference, including empty state, newest-first story list, favorite/delete/open actions, and long-title/long-text wrapping.
- [ ] Align Settings with the Stitch reference while preserving localStorage normalization, save feedback, safe defaults, and draft-preservation behavior.
- [ ] Add regression tests that prove shared shell navigation still switches tabs, generated Result still renders after success, History actions remain callable, and Settings save still applies to future Create drafts.

Testing notes:
Run `npm test` and `npm run lint` from `frontend/` after implementation. Add component tests for behavior that can regress during visual rewrites, not snapshot-only tests. Do manual browser checks at narrow mobile, tablet, and desktop widths against each `screen.png`, with explicit checks for clipping, overlapping fixed navigation, long Portuguese labels, long generated story text, empty History, loading, validation errors, and storage warnings.

Risks:
- Screen parity work can accidentally change feature behavior because the same components own both visuals and state.
- Copying exported HTML/CSS directly may introduce brittle structure, unused styles, or inaccessible controls.
- The Stitch screens may not include every application state already required by the specs, especially error, loading, empty, disabled, favorite-in-flight, and storage-failure states.
- History asset import is incomplete locally, so treating `frontend/assets/stitch/` as complete would miss one screen.

Open technical questions:
- Should Result remain nested under the Create tab after generation, as currently implemented, or should the shared shell expose a distinct `Resultado` navigation state? Technical recommendation: keep Result as the post-success Create state for MVP unless product explicitly adds a permanent Result tab.
- Should mobile navigation include Favorites even though this Stitch parity feature lists only Create, Result, History, and Settings? Technical recommendation: preserve existing Favorites behavior from Feature 06 and visually align it with the shell rather than remove it.

## PM Failure Analysis - 2026-05-02

Current QA failure:
Resolved. The History Stitch import was incomplete because the target folder contained `code.html` instead of the required `stitch-code.html`.

Observed files:
- Present: `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/screen.png`
- Present with wrong target name: `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/code.html`
- Present: `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/stitch-code.html`

Product interpretation:
This is not a missing fallback-source problem. The fallback source exists under `external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/`. The remaining gap is an import/normalization step: copy or rename the imported History `code.html` file to `stitch-code.html` so all screen reference folders use the same app-facing file contract.

Required closure:
- [X] Rename or copy `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/code.html` to `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/stitch-code.html`.
- [X] Rerun `npm test -- --runTestsByPath src/components/stitch-screen-implementation.test.tsx` from `frontend/`.

## TODO

- [ ] Download Stitch image and code exports for all four screens.
- [ ] If Stitch MCP export is unavailable, copy the four fallback `screen.png`/`code.html` pairs from `external-assets/stitch/stitch_contos_de_ninar_control_panel/` into `frontend/assets/stitch/<screen-id>/`, renaming each `code.html` target to `stitch-code.html`.
- [X] Import the History fallback pair from `external-assets/stitch/stitch_contos_de_ninar_control_panel/hist_rico_de_hist_rias/` into `frontend/assets/stitch/b610fe1a118c47e9a25a537c1d1e6230/`.
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
