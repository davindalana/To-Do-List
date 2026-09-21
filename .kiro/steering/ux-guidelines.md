# UI/UX Guidelines

## Design Principles

- **Simple first** — the interface should be immediately understandable with no instructions needed
- **Minimal chrome** — avoid decorative elements that don't serve a function
- **Fast feedback** — every user action (add, delete, complete) should produce an immediate visible response

## Layout

- Single-page, vertically centered layout
- Max width ~600px, centered on desktop — feels focused, not spread out
- Input field + Add button at the top, task list below, filter controls at the bottom

## Colors

Use a small, intentional palette:

| Role            | Suggestion          |
|-----------------|---------------------|
| Background      | `#f5f5f5` (light gray) |
| Surface (card)  | `#ffffff`           |
| Primary action  | `#4f46e5` (indigo)  |
| Danger (delete) | `#ef4444` (red)     |
| Completed text  | `#9ca3af` (muted gray) |

Define these as CSS custom properties so they're easy to swap.

## Typography

- System font stack: `'Segoe UI', Roboto, sans-serif`
- Base size: `16px`
- Task text uses `1rem`, headings `1.5rem`
- Completed tasks get `line-through` + muted color — not hidden

## Interactions

- Completed tasks are visually struck through but remain visible unless filtered out
- Delete button appears on hover/focus of a task item (reduces visual clutter)
- Empty state: show a friendly message when no tasks exist ("Nothing to do. Add a task above.")
- Filter tabs (All / Active / Completed) use an active indicator, not just bold text

## Accessibility

- Minimum contrast ratio 4.5:1 for all text
- Focus rings must be visible — do not remove `outline` without a replacement
- All buttons have accessible names (`aria-label` where text is absent)
- App is fully operable via keyboard only
