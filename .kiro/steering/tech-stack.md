---
inclusion: always
---

# Tech Stack

## Frontend

- **HTML5** — use semantic elements (`<main>`, `<section>`, `<ul>`, `<li>`, `<button>`)
- **CSS3** — vanilla CSS only; no frameworks, no preprocessors
- **JavaScript (ES6+)** — vanilla JS only; no build step, no bundler

The app runs by opening `index.html` directly in a browser. Do not introduce a build pipeline.

> Preferred upgrade path if complexity grows: React + Vite. Do not introduce any framework until that threshold is reached.

## Storage

- Use `localStorage` for all task persistence — no backend, no cookies, no IndexedDB
- Serialize task arrays as JSON; parse on load, stringify on save

## Dependencies

- **No npm packages.** Do not create or modify a `package.json`.
- If an external library becomes unavoidable, load it via a CDN `<script>` tag — do not install it.
- Never add React, Vue, Angular, or any component framework for this project scope.

## File Structure

```
/
├── index.html
├── style.css
└── app.js
```

Keep the structure flat. Do not create subdirectories unless the project scope explicitly expands.
