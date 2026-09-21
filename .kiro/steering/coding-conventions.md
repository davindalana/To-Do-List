# Coding Conventions

## File Structure

```
/
├── index.html
├── style.css
└── app.js
```

Keep everything flat. No subdirectories unless the project expands significantly.

## JavaScript

- Use `const` by default, `let` when reassignment is needed — never `var`
- Use arrow functions for callbacks
- Use `camelCase` for variables and functions
- Use descriptive names: `addTask`, `deleteTask`, `toggleComplete` — not `fn1`, `doThing`
- Group related logic into clearly named functions; avoid long single-function scripts
- Use `data-id` attributes on DOM elements to tie UI to task data

## CSS

- Use kebab-case for class names: `.task-item`, `.btn-delete`
- Keep specificity low — prefer class selectors over IDs for styling
- Use CSS custom properties (`--variables`) for colors and repeated values
- Mobile-first layout; ensure the app is usable on small screens

## HTML

- Use semantic elements: `<main>`, `<section>`, `<ul>`, `<li>`, `<button>`
- Every interactive element must be keyboard accessible
- Include `aria-label` on icon-only buttons

## General

- Keep functions small and single-purpose
- Comment non-obvious logic, skip obvious comments
- No console.log left in production code
