# Implementation Plan: To Do List App

## Overview

Implement a single-page To Do List app using vanilla HTML5, CSS3, and JavaScript (ES6+). The app runs by opening `index.html` directly in a browser with no build step, no framework, and no npm packages. All state is managed in memory and persisted to `localStorage` as JSON. The implementation follows a unidirectional data flow: user action → state mutation → `saveTasks()` → `renderTasks()`.

## Tasks

- [x] 1. Create the HTML skeleton (`index.html`)
  - [x] 1.1 Write semantic HTML structure with `<main>`, `<section>`, `<ul>`, `<footer>`, and all interactive elements
    - Include `#task-input`, `#add-btn`, `#task-list`, `#empty-state`, and three `.filter-btn` elements with `data-filter` attributes (`all`, `active`, `completed`)
    - Link `style.css` and `app.js` via `<link>` and `<script defer>` tags
    - Add `aria-label` attributes on all icon-only or text-absent buttons; `#add-btn` has visible text "Add" so no `aria-label` needed there
    - _Requirements: 1.1, 3.3, 4.1, 6.1, 6.3_

- [x] 2. Create the CSS stylesheet (`style.css`)
  - [x] 2.1 Define CSS custom properties and base layout
    - Declare `--color-bg`, `--color-surface`, `--color-primary`, `--color-danger`, `--color-completed` custom properties matching the design palette
    - Set `font-family` to the system font stack (`'Segoe UI', Roboto, sans-serif`), `font-size: 16px`, centered single-column layout, max-width ~600px
    - _Requirements: 6.4_
  - [x] 2.2 Style the input section, task list, and filter footer
    - Style `.input-section` (flex row, gap, full-width input)
    - Style `#task-list` (`<ul>`) and `.task-item` (`<li>`) with surface color, spacing, and flex layout for text + controls
    - Style `.filter-btn` with an active indicator (background highlight or underline) for the `.active` class — distinct from non-active buttons
    - Style `#empty-state` message (centered, muted)
    - _Requirements: 2.4, 3.3, 3.4, 4.6_
  - [x] 2.3 Style completed tasks, delete button visibility, and focus rings
    - Completed `.task-item` text: `text-decoration: line-through`, color `var(--color-completed)`
    - `.btn-delete`: hidden by default (`opacity: 0` or `visibility: hidden`); revealed on `.task-item:hover` and `.task-item:focus-within`
    - All interactive elements: visible `:focus-visible` ring — do NOT suppress `outline` without a replacement
    - _Requirements: 2.4, 3.4, 6.2_

- [x] 3. Implement core state and storage (`app.js` — state, load, save)
  - [x] 3.1 Set up the module-scoped state block and `loadTasks` / `saveTasks`
    - Wrap all code in an IIFE (or top-level block) to avoid polluting the global scope
    - Declare `let tasks = []` and `let currentFilter = 'all'`
    - Define `const STORAGE_KEY = 'todo-tasks'`
    - Implement `loadTasks()`: read from `localStorage.getItem(STORAGE_KEY)`, parse JSON, fall back to `[]` in a `try/catch`
    - Implement `saveTasks()`: `localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))` wrapped in `try/catch`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 3.2 Write property test for P5 — Mutation persistence round-trip and P9 — Init loads persisted list
    - **Property 5: Every mutation is immediately reflected in localStorage (persistence round-trip)**
    - **Validates: Requirements 1.4, 2.3, 3.2, 5.3**
    - **Property 9: Initialization loads the persisted task list**
    - **Validates: Requirements 5.1**
    - Use fast-check (CDN) in the test harness; mock `localStorage` with a simple in-memory map; run ≥ 100 iterations
    - Tag each test: `// Feature: todo-list-app, Property 5: ...` and `// Feature: todo-list-app, Property 9: ...`

- [x] 4. Implement task mutation functions (`addTask`, `toggleTask`, `deleteTask`)
  - [x] 4.1 Implement `addTask(description)`
    - Trim input; reject (return early) if `trimmed.length === 0` or `trimmed.length > 500`
    - Create a Task object: `{ id: crypto.randomUUID() ?? Date.now().toString(), description: trimmed, completed: false, createdAt: Date.now() }`
    - Push to `tasks`, call `saveTasks()`, call `renderTasks()`, clear `#task-input`, return focus to `#task-input`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 4.2 Write property test for P1 — Valid addition grows list
    - **Property 1: Valid task addition grows the task list**
    - **Validates: Requirements 1.1**
    - Generate random non-empty strings ≤ 500 chars; assert `tasks.length` increases by 1 and last task has correct `description`
    - Tag: `// Feature: todo-list-app, Property 1: ...`
  - [x] 4.3 Write property test for P2 — Invalid input rejected, list unchanged
    - **Property 2: Invalid input is rejected and leaves the task list unchanged**
    - **Validates: Requirements 1.2**
    - Generate whitespace-only strings and strings > 500 chars; assert `tasks` array is unchanged after `addTask` call
    - Tag: `// Feature: todo-list-app, Property 2: ...`
  - [x] 4.4 Implement `toggleTask(id)`
    - Find the task in `tasks` by `id`; guard against missing `id` (return early if not found)
    - Flip `completed` boolean; call `saveTasks()`, call `renderTasks()`
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 4.5 Write property test for P3 — Toggle round-trip
    - **Property 3: Toggle is its own inverse (round-trip)**
    - **Validates: Requirements 2.1, 2.2**
    - Generate random task lists; pick a random task; call `toggleTask` twice; assert `completed` status is unchanged
    - Tag: `// Feature: todo-list-app, Property 3: ...`
  - [x] 4.6 Implement `deleteTask(id)`
    - Filter `tasks` to remove the element with matching `id`; guard against missing `id`
    - Reassign `tasks`, call `saveTasks()`, call `renderTasks()`
    - _Requirements: 3.1, 3.2_
  - [x] 4.7 Write property test for P4 — Delete removes task
    - **Property 4: Deleting a task removes it from the list**
    - **Validates: Requirements 3.1**
    - Generate random task lists (length ≥ 1); pick a random task id; call `deleteTask`; assert list is one shorter and contains no element with that id
    - Tag: `// Feature: todo-list-app, Property 4: ...`

- [x] 5. Checkpoint — Verify state and storage logic
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement filter functions (`setFilter`, `getFilteredTasks`)
  - [x] 6.1 Implement `setFilter(filter)` and `getFilteredTasks()`
    - `setFilter`: assign `currentFilter = filter`, call `renderTasks()`, call `renderFilterButtons()`
    - `getFilteredTasks`: return `tasks` (all), `tasks.filter(t => !t.completed)` (active), or `tasks.filter(t => t.completed)` (completed) based on `currentFilter`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 6.2 Write property test for P6 — "all" filter returns everything
    - **Property 6: "all" filter displays every task regardless of status**
    - **Validates: Requirements 4.3**
    - Generate random task lists with mixed statuses; set `currentFilter = 'all'`; assert `getFilteredTasks().length === tasks.length`
    - Tag: `// Feature: todo-list-app, Property 6: ...`
  - [x] 6.3 Write property test for P7 — Status filters show only matching tasks
    - **Property 7: Status filters show only tasks matching their condition**
    - **Validates: Requirements 4.4, 4.5**
    - Generate random task lists; for `'active'` assert all results have `completed === false`; for `'completed'` assert all results have `completed === true`
    - Tag: `// Feature: todo-list-app, Property 7: ...`

- [x] 7. Implement DOM rendering (`renderTasks`, `renderFilterButtons`, `createTaskElement`)
  - [x] 7.1 Implement `createTaskElement(task)`
    - Create an `<li class="task-item">` with `data-id` attribute
    - Include a `<input type="checkbox" class="task-checkbox">` (checked if `task.completed`) with `aria-label` set to the task description
    - Include a `<span>` for the task description text
    - Include a `<button class="btn-delete" aria-label="Delete task">` with a visible icon or text
    - Apply the completed styling class when `task.completed` is true
    - _Requirements: 2.4, 3.4, 6.1, 6.3_
  - [x] 7.2 Implement `renderTasks()`
    - Call `getFilteredTasks()` to get the visible subset
    - Clear and rebuild `#task-list` by calling `createTaskElement` for each task and appending to the `<ul>`
    - Toggle visibility of `#empty-state` based on whether the filtered list is empty
    - _Requirements: 3.3, 4.3, 4.4, 4.5, 4.7_
  - [x] 7.3 Implement `renderFilterButtons()`
    - For each `.filter-btn`, add the `active` CSS class if its `data-filter` matches `currentFilter`, remove it otherwise
    - _Requirements: 4.2, 4.6_
  - [x] 7.4 Write property test for P8 — Empty filter result shows empty state
    - **Property 8: A filter that matches no tasks produces the empty state**
    - **Validates: Requirements 3.3, 4.7**
    - Generate task lists and filters that match no tasks; call `renderTasks()`; assert `#empty-state` is visible and `#task-list` contains zero `<li>` elements
    - Tag: `// Feature: todo-list-app, Property 8: ...`
  - [x] 7.5 Write property test for P10 — Buttons without visible text have aria-label
    - **Property 10: Every button without visible text has an aria-label**
    - **Validates: Requirements 6.3**
    - Enumerate all rendered `<button>` elements in each filter state; assert every button with empty or absent `textContent` has a non-empty `aria-label` attribute
    - Tag: `// Feature: todo-list-app, Property 10: ...`

- [x] 8. Wire up event listeners and initialize the app
  - [x] 8.1 Attach all event listeners and call initialization
    - `click` on `#add-btn` → `addTask(input.value)`
    - `keydown` (Enter) on `#task-input` → `addTask(input.value)`
    - Delegated `change` on `#task-list` for `.task-checkbox` → `toggleTask(dataset.id)`
    - Delegated `click` on `#task-list` for `.btn-delete` → `deleteTask(dataset.id)`
    - Delegated `click` on `.filter-section` for `.filter-btn` → `setFilter(dataset.filter)`
    - Call `loadTasks()` then `renderTasks()` and `renderFilterButtons()` on `DOMContentLoaded`
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.2, 5.1, 6.1_

- [x] 9. Checkpoint — Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Accessibility audit
  - [x] 10.1 Add axe-core accessibility audit to test harness
    - Load axe-core via CDN `<script>` tag in the test harness HTML file
    - Run `axe.run()` against the rendered page in each filter state (`all`, `active`, `completed`) and assert zero violations
    - Verify Tab order manually: Input → Add → task checkboxes → delete buttons → filter buttons
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [~] 11. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints provide incremental validation gates before moving to the next phase
- Property tests use fast-check loaded via CDN — no npm install needed
- Accessibility tests use axe-core loaded via CDN in the test harness
- The test harness is a separate HTML file that loads `app.js` and the CDN libraries; it does not affect the production `index.html`
- All 10 correctness properties from the design document are covered by property-based tests
- Unit tests and property tests are complementary — unit tests cover specific edge cases, property tests validate universal behaviors

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "4.1"] },
    { "id": 3, "tasks": ["3.2", "4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["4.5", "4.6", "6.1"] },
    { "id": 5, "tasks": ["4.7", "6.2", "6.3", "7.1"] },
    { "id": 6, "tasks": ["7.2", "7.3"] },
    { "id": 7, "tasks": ["7.4", "7.5", "8.1"] },
    { "id": 8, "tasks": ["10.1"] }
  ]
}
```
