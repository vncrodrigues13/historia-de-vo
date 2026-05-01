# Feature: Story Creation Form

Goal:
Let the parent configure a personalized child story.

User value:
The parent can quickly define the child, theme, tone, duration, and one optional detail.

Priority:
Must have.

Development area:
Frontend. This feature covers UI fields, option controls, client-side validation, submit state, and handoff to generation.

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

## Implementation Plan

1. Build the form fields and option sets.
2. Validate required fields before submit.
3. Show inline errors for invalid inputs.
4. Send valid story parameters to the generation flow.

## TODO

- [ ] Create `story-form` component.
- [ ] Add fixed option lists.
- [ ] Add client-side validation.
- [ ] Add submit loading state.
- [ ] Pass valid input to story generation.

## Acceptance Seeds

- Empty child name blocks submit.
- Age outside 1 to 12 blocks submit.
- Valid input starts story generation.

## Open Questions

- What is the maximum length for special detail?

## Out of Scope

- Saved child profiles.
- Custom themes outside the fixed list.
