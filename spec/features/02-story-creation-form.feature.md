# Feature: Story Creation Form

Goal:
Let the parent configure a personalized child story.

User value:
The parent can quickly define the child, theme, tone, duration, and one optional detail.

Priority:
Must have.

Development area:
Frontend. This feature covers UI fields, option controls, client-side validation, submit state, and handoff to generation.

Stitch screen:
`Criar História (Restaurada)` from project `15204996058292121576`, screen `8a422bd8840044ab9b40c7f313011b02`.

Asset fallback:
When the Stitch MCP fetch is unavailable or incomplete, use `external-assets/stitch/stitch_contos_de_ninar_control_panel/criar_hist_ria_restaurada/` as the fallback source for the Create screen reference. The expected source files are `screen.png` and `code.html`; imported copies live in `frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/`.

## User Flow

1. The parent opens Create.
2. The parent enters the child name and age.
3. The parent selects theme, story type, and duration.
4. The parent optionally adds a special detail.
5. The parent submits the form to generate a story.

## Requirements

- Child name is required.
- Age must be between 1 and 12.
- Theme options: Adventure, Animals, Space, Princess/Prince, Dinosaurs, Fantasy and Magic, Nature.
- Story type options: Fun, Educational, Bedtime, Moral Lesson.
- Duration options: Short, Medium, Long.
- Special detail is optional and character-limited.
- User-facing labels, actions, and helper copy should be Portuguese-first when implementing the Stitch screen.
- The Create screen should match the extracted Stitch layout, spacing, and control hierarchy.
- Product decision: Create visual parity should use the Stitch MCP reference when available; if MCP fetching fails, continue with the checked-in `external-assets/` fallback rather than pausing implementation.
- Product decision: `specialDetail` maximum length is fixed at 160 characters for MVP.
- Product decision: age accepts only whole numbers from 1 to 12; decimal input must show a dedicated integer-only error.
- Product decision: after valid submit, keep the user in Create with loading feedback until generation resolves; move to Result only after success.

## Implementation Plan

1. Extract the Stitch image and code reference for `Criar História (Restaurada)`.
2. Build the form fields and option sets using project-native React components.
3. Match the Stitch layout, visual hierarchy, labels, and primary action treatment.
4. Validate required fields before submit.
5. Show inline errors for invalid inputs.
6. Send valid story parameters to the generation flow.

## Tech Lead Overview

Technical approach:
Replace the current Create placeholder with a controlled React form that owns draft edits, validation state, and submit status. Reuse the existing `StoryParams`, `StoryTheme`, `StoryType`, and `StoryDuration` domain types so the form hands a typed request directly to the generation feature. Keep fixed option metadata in one module so the Portuguese labels, submitted enum values, and tests cannot drift.

Affected areas:
`frontend/src/components/create-tab.tsx`, shared story domain types, Create tab styles in `frontend/app/globals.css`, form validation helpers, frontend tests, and the Story Generation integration boundary.

Dependencies:
- The Stitch reference must be downloaded before final layout matching.
- If Stitch MCP export is unavailable, import the Create reference from `external-assets/stitch/stitch_contos_de_ninar_control_panel/criar_hist_ria_restaurada/`.
- Story Generation needs a typed `onSubmit(params: StoryParams)` handoff or equivalent app-shell callback.
- Option values should continue to match the domain enum values already defined in `frontend/src/domain/story.ts`.
- `specialDetail` max length is fixed at 160 characters for MVP.

Engineering tasks:
- [x] Move theme, story type, and duration options into typed option metadata with Portuguese labels.
- [x] Add a pure `validateStoryParams` helper that trims text, enforces child name, age range, fixed option values, and special-detail length.
- [x] Update `CreateTab` to render Stitch-aligned controls, inline field errors, disabled/loading submit state, and accessible error messaging.
- [x] Keep draft state in the tab shell while exposing only validated `StoryParams` to generation.
- [x] Add unit/component tests for invalid name, invalid age, special-detail limit, valid submit payload, and submit loading behavior.
- [ ] Coordinate with Story Generation so duplicate validation rules do not diverge between form submit and provider request handling.

Testing notes:
Use component tests for user flows rather than snapshot-only layout checks. Cover keyboard/select interactions, inline error rendering, submit prevention, successful payload shape, and preservation of the draft while switching tabs. Once the Stitch implementation is available, add a lightweight visual/manual checklist for spacing, hierarchy, and Portuguese copy.

## QA Analysis

Acceptance criteria:
- The Create tab renders a Portuguese-first form with fields for child name, age, theme, story type, duration, optional special detail, and one clear primary submit action.
- Submitting with a blank or whitespace-only child name is blocked, shows an inline error next to the name field, and does not call story generation.
- Submitting with an empty, non-numeric, decimal, or out-of-range age is blocked with a clear inline error. Valid ages are whole numbers from 1 through 12.
- Theme, story type, and duration controls only submit values from the fixed domain option lists while displaying Portuguese labels.
- Special detail can be left empty. When provided, it is trimmed before submit and blocked if it exceeds the decided maximum length.
- A valid submit emits exactly one `StoryParams` payload with trimmed text, numeric age, enum values, and no empty `specialDetail` property.
- While generation handoff is pending, the submit action shows loading feedback, prevents duplicate submits, and keeps the draft visible.
- Form state is preserved when switching away from Create and back.
- Error messages are associated with their fields for screen readers and are cleared when the user corrects the invalid input.

Test coverage:
- Component tests should cover empty name, whitespace name, empty age, non-numeric age, decimal age, ages below 1 and above 12, each valid boundary age, special-detail limit, valid payload shape, duplicate-submit prevention, and draft preservation across tab switches.
- Add keyboard interaction coverage for option controls and submit from the keyboard.
- Add a focused validation helper test if validation is extracted into a pure function.
- Add an integration-style test around the Create-to-generation boundary once `onSubmit(params: StoryParams)` or the equivalent app-shell callback exists.

Manual checks:
- Compare the implemented Create screen against the Stitch `Criar História (Restaurada)` reference for layout, spacing, visual hierarchy, primary action treatment, and responsive behavior.
- Confirm all visible labels, helper text, validation messages, and actions are Portuguese-first.
- Check mobile and desktop widths for clipped labels, overlapping controls, and accessible tap targets.
- Verify loading, disabled, error, and corrected-field states in browser.

Risks:
- Current domain values are English enums; labels and submitted values can drift unless options are modeled as shared `{ value, label }` metadata.
- Age parsing from number inputs can silently produce `NaN` or unexpected values, so validation should not rely only on HTML input attributes.
- Generation also owns request validation in the next feature; use shared validation rules or explicitly document the boundary to avoid conflicting errors.

Technical risks:
- The Create form and Story Generation feature both mention validation; shared validation should prevent contradictory behavior.
- HTML number inputs can produce `NaN` or empty values, so age parsing needs explicit handling before submit.
- Portuguese labels with English enum values are easy to mix up unless options are modeled as `{ value, label }`.
- If the form calls generation directly, loading/error state can become tightly coupled to provider details.

Open technical questions:
- No open technical questions for Feature 02 behavior.

## TODO

- [X] Download `Criar História (Restaurada)` Stitch references into `frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/`.
- [X] Confirm `Criar História (Restaurada)` fallback files exist under `external-assets/stitch/stitch_contos_de_ninar_control_panel/criar_hist_ria_restaurada/`.
- [X] Create `story-form` component.
- [X] Add fixed option lists.
- [X] Update visible form copy to Portuguese-first labels.
- [X] Match the Stitch Create screen layout and visual treatment.
- [X] Add client-side validation.
- [X] Add submit loading state.
- [X] Pass valid input to typed submit boundary (`onSubmit(params: StoryParams)`).

## Acceptance Seeds

- Empty child name blocks submit.
- Whitespace-only child name blocks submit.
- Age outside 1 to 12 blocks submit.
- Empty, non-numeric, or decimal age blocks submit.
- Special detail is optional but respects the configured character limit.
- Valid submit trims text and sends one typed `StoryParams` payload.
- Duplicate submits are blocked while generation is pending.
- Draft values are preserved while switching tabs.
- Valid input starts story generation.

## Open Questions

Resolved on 2026-05-02:
- `specialDetail` max length is 160 characters.
- Decimal age input is invalid and must show dedicated integer-only messaging.
- Create keeps loading feedback after submit and transitions only after generation success.

## PM Resolution - 2026-05-02

Goal:
Remove ambiguous product decisions that block implementation completion.

User flow:
Parent submits in Create, sees loading in Create, then sees Result only after generation success.

Decisions:
- Keep current Portuguese-first form fields and validation behavior.
- Lock `specialDetail` max length to 160 for MVP.
- Keep integer-only age validation (`1..12`) with explicit decimal rejection.
- Do not block story-generation integration on Stitch asset download; visual parity remains a follow-up task.

First-version scope:
- Form complete with validation and typed payload handoff.
- Real Create-to-generation wiring is required to close the feature.

Out of scope:
- Pixel-perfect Stitch parity before generation integration.

## Out of Scope

- Saved child profiles.
- Custom themes outside the fixed list.

## QA Implementation Review - 2026-05-02

Verdict:
Partially complete. Feature 02 form behavior is implemented and validated; visual Stitch parity remains open and end-to-end generation behavior is owned by Feature 03.

Acceptance criteria:
- Implemented: Portuguese-first form fields, options, inline errors, trimming, age validation, optional `specialDetail`, submit loading, and duplicate-submit guard in `frontend/src/components/create-tab.tsx`.
- Implemented: draft preservation across tab switches in `frontend/src/components/tab-shell.tsx`.
- Implemented: valid submit emits typed `StoryParams` through `onSubmit(params: StoryParams)` boundary.
- Implemented: option controls use fixed select options and `validateStoryParams` rejects invalid enum values.
- Partial: Stitch reference assets are now present locally; layout verification against those assets is still pending.

Test coverage:
- Verified: `npm test` passed with 7 tests across 2 suites.
- Verified: `npm run lint` passed.
- Covered: blank/whitespace-only name, empty/non-numeric/decimal/out-of-range age validation, age boundaries `1` and `12`, special-detail max length, invalid fixed option values, valid payload shape, duplicate-submit prevention, error clearing on correction, keyboard submit, and draft persistence.
- Still missing from this feature spec criteria: explicit option-control keyboard navigation assertions and field-to-error accessibility association assertions.

Manual checks:
- Still needed: compare against Stitch `Criar História (Restaurada)` for spacing, hierarchy, visual treatment, and responsive behavior.
- Still needed: browser checks for mobile/desktop clipping, tap targets, disabled/loading/error/corrected states.

Risks:
- Feature 03 integration is still required to turn the submit boundary into real generation behavior.
- Layout may diverge from Stitch because the reference was not downloaded or checked.
- Validation can drift because fixed option metadata is local to the component, not shared with domain/generation validation.
- Test suite is green, but visual/layout checks against Stitch are still pending.

## Dev Implementation Notes - 2026-05-02

Status for Feature 02:
- Complete for form behavior and typed handoff boundary.
- Remaining work is visual parity with Stitch assets.

Boundary with Feature 03:
- Feature 02 owns collecting and validating `StoryParams` and calling `onSubmit(params)`.
- Feature 03 owns real generation service wiring, generation lifecycle handling, and Result-screen transition.

## Dev Visual Parity Notes - 2026-05-02

Reference used:
- `frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/screen.png`
- `frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/stitch-code.html`

Observed parity gaps (current implementation vs Stitch Create screen):
- Layout shell mismatch: current UI uses a centered card with border/shadow, while Stitch uses a full-page warm background, top app bar, and wide centered content container.
- Navigation mismatch: current tab navigation is a boxed grid of buttons; Stitch uses inline header links with active underline and a profile icon area.
- Form control mismatch: current `theme`, `storyType`, and `duration` use `<select>` controls; Stitch uses chip-style button groups for theme/type and a segmented control for duration.
- Typography and color mismatch: current global styles use system sans and teal/gray accents; Stitch uses serif heading + Manrope body with warm neutral surfaces and terracotta primary.
- Copy hierarchy mismatch: current Create heading/copy differs from Stitch (`Nova História` plus the longer subtitle).
- CTA mismatch: current submit button shape/color/height differs from Stitch (full-width rounded pill, terracotta, `✦ Gerar História` styling).
- Decorative/detail layer missing: subtle star/moon motifs and Stitch spacing rhythm are not represented in current UI shell.

Implementation guardrails for parity patch:
- Preserve current validation logic and submit behavior (`validateStoryParams`, inline errors, loading, duplicate-submit guard).
- Preserve Portuguese-first copy requirements and fixed domain option values.
- Replace only visual/layout primitives and option control presentation, not behavior contracts.

## PM Visual Gap Analysis - 2026-05-02

Goal:
Close the remaining Create-screen product gap by aligning the implemented form with the approved Stitch direction without reopening validation or generation scope.

User value:
The parent should experience Create as a warm, storybook-like composition rather than a generic settings form. The form already works; the missing value is confidence, emotional fit, and visual continuity with the rest of the product.

Priority:
Must finish before Feature 02 can be called product-complete. This is not a blocker for Feature 03 generation wiring, but it is a blocker for shipping the Create screen as the intended MVP experience.

Product assessment of missing points:
- Layout shell mismatch is a high-priority product issue because it changes the perceived app structure. The MVP should use the Stitch-style warm page background, top navigation, and wider centered content area.
- Navigation mismatch is a medium-priority cross-screen issue. The Create screen should not invent a separate tab style if the product shell is meant to look like Stitch. If the shell is shared, resolve this in the shared tab shell rather than only inside Create.
- Form control mismatch is a high-priority interaction issue. Theme, story type, and duration are small fixed-choice decisions; chip/segmented controls are clearer and more playful than dropdowns for the target parent flow.
- Typography and color mismatch is a high-priority brand issue. Use the Stitch serif heading, Manrope body feel, warm neutrals, and terracotta primary treatment as the product direction.
- Copy hierarchy mismatch is a medium-priority clarity issue. Use the Stitch `Nova História` heading and longer explanatory subtitle unless implementation discovers the exact text harms mobile fit.
- CTA mismatch is a high-priority conversion issue. The primary action should feel like the visual endpoint of the form: full-width, rounded, terracotta, and labelled `✦ Gerar História`.
- Decorative/detail layer is a low-priority polish issue. Add it only if it does not complicate responsive behavior or accessibility.

Acceptance criteria for closing the gap:
- Create uses the Stitch-inspired warm full-page shell rather than the current generic centered card.
- Header/navigation visually matches the Stitch direction or a shared app-shell decision documented outside this feature.
- Fixed option fields render as accessible button groups or segmented controls while preserving the same submitted enum values.
- The primary CTA uses the Stitch wording and visual treatment, including loading and disabled states.
- Portuguese-first labels and validation messages remain unchanged unless the Stitch copy explicitly improves them.
- The page is manually checked at mobile and desktop widths for clipping, overlapping controls, tap target size, and visible loading/error states.
- Existing validation and submit tests remain green after the visual patch.

First-version scope:
- Implement the visual hierarchy, controls, colors, typography, and CTA treatment.
- Keep decorative motifs minimal and non-blocking.
- Preserve current `onSubmit(params: StoryParams)` contract.

Out of scope:
- Pixel-perfect reproduction of every Stitch spacing value.
- New fields, saved child profiles, custom themes, or generation behavior changes.
- Reworking validation copy beyond matching Portuguese-first product language.

Open questions:
- Should the Stitch-style app shell be applied globally now, or only to Create until other screens are restored?
- Should decorative motifs be implemented as CSS-only details or reusable assets from the Stitch export?

## PM Remediation Plan - 2026-05-02

Goal:
Move the current working Create form to the expected Stitch result shown in the reference image while preserving all existing validation, draft, loading, and submit behavior.

Plan:
1. Update the shared app shell first.
   - Replace the current white `app-card` container with a full-page warm background.
   - Move the app title and tab navigation into one top app bar.
   - Use `Contos de Ninar` as the visible brand title to match the reference image unless the product name is intentionally locked elsewhere as `Histórias de Vó`.
   - Render navigation as inline links/buttons with the active `Criar` underline instead of boxed tab buttons.
   - Add the profile icon area as a non-functional visual placeholder for MVP.

2. Rebuild the Create content layout.
   - Use a wide centered content column with the same generous top spacing as the reference.
   - Change the heading from `Criar história` to `Nova História`.
   - Change the subtitle to: `Prepare um momento especial. Escolha os detalhes abaixo e nós criaremos um conto de ninar único para embalar o sono.`
   - Arrange child name and age in a two-column row on desktop and a single column on mobile.
   - Keep the field order exactly as the reference: name, age, theme, story type, duration, special detail, submit.

3. Replace dropdowns with fixed-choice controls.
   - Render theme as wrapping pill buttons.
   - Render story type as pill buttons.
   - Render duration as a segmented control.
   - Keep the existing enum values in submitted `StoryParams`.
   - Preserve keyboard access using native buttons, `aria-pressed` or equivalent selected-state semantics, and visible focus states.

4. Apply the visual system from the reference.
   - Use warm off-white page background and beige input surfaces.
   - Use a serif display font feel for headings and brand.
   - Use a clean sans body font feel matching Manrope.
   - Use terracotta as the active/primary color.
   - Match the reference input height, rounded corners, chip borders, and selected states closely enough for visual parity.

5. Update the primary CTA.
   - Use full-width pill styling at the bottom of the form.
   - Label the idle state `✦ Gerar História`.
   - Keep loading feedback in place with a disabled state and no duplicate submits.
   - Ensure the disabled/loading state remains readable against the terracotta palette.

6. Add low-risk decorative details.
   - Add the subtle star and moon details only as non-interactive decoration.
   - Prefer CSS pseudo-elements or lightweight inline decoration over adding new image dependencies unless Stitch assets are already necessary.
   - Hide or reposition decoration on small screens if it competes with form content.

7. Preserve and extend verification.
   - Keep existing validation tests green.
   - Add or update tests for option button selection, keyboard submit, accessible selected state, and error associations if missing.
   - Run lint and tests after implementation.
   - Manually compare desktop and mobile against the reference image for spacing, hierarchy, field order, CTA treatment, and clipped content.

Implementation order:
- [x] Shell and navigation visual structure.
- [x] Create heading, subtitle, content width, and responsive field grid.
- [x] Theme/type chip controls and duration segmented control.
- [x] Visual tokens for background, typography, inputs, chips, and CTA.
- [x] Decorative star/moon details.
- [x] Accessibility and test updates.
- [ ] Manual desktop/mobile comparison against the reference image.

Non-negotiables:
- Do not change `validateStoryParams` rules.
- Do not change `StoryParams` enum values.
- Do not add generation behavior in this patch.
- Do not replace tested behavior with visual-only markup that weakens accessibility.

Definition of done:
- The Create screen visually reads as the same product direction as the reference image.
- All current form behavior still works.
- Fixed-choice controls are no longer dropdowns.
- `npm test` and `npm run lint` pass.
- Remaining differences, if any, are documented as explicit product tradeoffs rather than accidental drift.

## Tech Lead Complement - 2026-05-02

Technical approach:
Implement this as a visual/parity refactor with behavior preservation. Split the work into app-shell styling, Create layout styling, and fixed-option control rendering so each change can be reviewed independently. Avoid coupling this patch to Feature 03 generation; the only integration contract that should remain visible is `onSubmit(params: StoryParams)`.

Affected areas:
- `frontend/src/components/tab-shell.tsx` for the top app bar, tab presentation, active state, and profile placeholder.
- `frontend/src/components/create-tab.tsx` for heading copy, responsive field grouping, chip controls, segmented duration, and CTA markup.
- `frontend/app/globals.css` for design tokens, shell layout, typography, form surfaces, control states, responsive rules, and decorative pseudo-elements.
- `frontend/src/components/create-tab.test.tsx` for chip/segmented-control behavior and accessibility assertions.
- `frontend/src/components/tab-shell.test.tsx` only if tab semantics or accessible labels change.

Implementation decisions:
- Keep native `<button type="button">` elements for theme, story type, and duration options. This preserves keyboard operability without building a custom roving-tabindex widget.
- Use `aria-pressed` for selected chip/segment state, plus visible selected styling. Do not use hidden radios unless tests or screen-reader behavior show button state is insufficient.
- Keep existing option metadata arrays as the single rendering source for labels and submitted values.
- Introduce CSS custom properties for the Stitch visual tokens: warm background, text, muted text, input surface, border, terracotta primary, selected chip surface, and focus ring.
- Keep all decorative star/moon elements `aria-hidden="true"` or CSS-only so they do not enter the accessibility tree.
- Preserve current form validation and trimming exactly; this patch should not edit `validateStoryParams` except if types require harmless refactoring.

Engineering tasks:
- [x] Convert `TabShell` from card-based layout to full-page shell with top app bar and inline tab buttons.
- [x] Confirm final visible brand string: use `Contos de Ninar` for Stitch parity unless PM explicitly retains `Histórias de Vó`.
- [x] Add semantic grouping wrappers in `CreateTab` for desktop two-column name/age layout and fixed option sections.
- [x] Replace `select` controls with button groups backed by `themeOptions`, `storyTypeOptions`, and `durationOptions`.
- [x] Add duration labels with estimated minutes: `Curta (~3 min)`, `Média (~7 min)`, `Longa (~12 min)` while preserving submitted values.
- [x] Update CTA copy to `✦ Gerar História` and loading copy to a Portuguese-first equivalent that fits the same button.
- [x] Add CSS variables and restyle page shell, nav, headings, fields, chips, segmented control, textarea, CTA, focus, error, disabled, and mobile states.
- [x] Add CSS-only decorative star/moon details after the core layout is stable.
- [x] Update component tests for selecting chip/segmented options and verifying the submitted payload still uses enum values.
- [x] Add accessibility assertions for `aria-invalid`, `aria-describedby`, selected option state, and keyboard submit if not already covered.
- [x] Run `npm test` and `npm run lint`.

Testing notes:
Prioritize behavior tests over snapshot tests. Visual parity should be checked manually against the provided reference image at desktop width and at one mobile breakpoint. Automated tests should verify that replacing selects with buttons does not regress payload shape, duplicate-submit protection, loading state, draft persistence, or validation errors.

Technical risks:
- Updating the shared shell can affect History, Favorites, and Settings screens. Keep empty/placeholder tabs readable inside the new shell.
- Replacing selects with buttons can accidentally remove accessible field semantics. Use `fieldset`/`legend` or labelled groups for each option set.
- CSS global changes can create broad regressions. Prefer component-scoped class names and root token variables over generic element selectors.
- Brand naming is inconsistent between current code (`Histórias de Vó`) and the reference (`Contos de Ninar`). This needs a product decision before implementation is considered complete.
- Font parity may require loading external fonts. If the project has no font pipeline yet, use local CSS font stacks as a temporary approximation and document the difference.

Open technical questions:
- Should the brand name be changed globally to `Contos de Ninar`, or is the reference name only visual placeholder copy?
- Are external font assets allowed in this sprint, or should typography be approximated with local/system serif and sans stacks?
- Should the app shell refactor be extracted into a dedicated layout component now, or remain in `TabShell` until more screens are implemented?

## Dev Completion Notes - 2026-05-02

Implemented:
- Converted the shared shell to the Stitch-style warm full-page layout with top app bar, inline desktop tabs, mobile bottom navigation, and CSS-only decorative details.
- Updated Create to use the Stitch heading/subtitle hierarchy, two-column field grid, chip-style theme/type controls, segmented duration controls with estimated minutes, warm form surfaces, and full-width terracotta CTA.
- Preserved the existing `validateStoryParams` rules, typed `onSubmit(params: StoryParams)` boundary, loading state, duplicate-submit guard, draft preservation, and inline errors.
- Added tests for option button selection, enum payload preservation, selected `aria-pressed` state, and error description association.

Validation:
- `npm test` passed: 12 tests across 2 suites.
- `npm run lint` passed.
- `npm run build` passed.

Remaining manual check:
- Browser desktop/mobile visual comparison is available at `http://localhost:3000` while the dev server is running.
