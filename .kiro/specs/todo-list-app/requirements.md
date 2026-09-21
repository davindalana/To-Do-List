# Requirements Document

## Introduction

This document defines the requirements for a To Do List web application built with vanilla HTML, CSS, and JavaScript. The app runs directly in a browser by opening `index.html` — no build step, no framework, no backend. Users can add, complete, delete, and filter tasks, with all data persisted across page refreshes via `localStorage`.

## Glossary

- **App**: The To Do List single-page web application.
- **Task**: A unit of work with a text description and a completion status (active or completed).
- **Task_List**: The ordered collection of all tasks currently held in memory and reflected in the UI.
- **Storage**: The browser's `localStorage` API used for persistence.
- **Filter**: The currently selected view mode — one of `all`, `active`, or `completed`.
- **Input_Field**: The text input element where users type a new task description.
- **Add_Button**: The button (or Enter key) that triggers task creation.
- **Delete_Button**: The per-task button that removes a task from the Task_List.
- **Complete_Toggle**: The per-task control (checkbox) that toggles a task between active and completed.

---

## Requirements

### Requirement 1: Add New Tasks

**User Story:** As a user, I want to add new tasks to the list, so that I can capture things I need to do.

#### Acceptance Criteria

1. WHEN a user types a task description in the Input_Field and presses Enter or clicks the Add_Button, THE App SHALL create a new Task whose description is the trimmed value of the Input_Field and append it to the Task_List.
2. WHEN a user attempts to add a task whose description, after trimming leading and trailing whitespace, is either empty or exceeds 500 characters, THE App SHALL reject the input and leave the Task_List unchanged.
3. WHEN a new Task is successfully added, THE App SHALL clear the Input_Field and return focus to it.
4. WHEN a new Task is successfully added, THE App SHALL persist the updated Task_List to Storage before the next user interaction can modify the Task_List.

---

### Requirement 2: Mark Tasks as Complete

**User Story:** As a user, I want to mark tasks as complete, so that I can track what I've already done.

#### Acceptance Criteria

1. WHEN a user activates the Complete_Toggle on an active Task, THE App SHALL update that Task's status to completed.
2. WHEN a user activates the Complete_Toggle on a completed Task, THE App SHALL update that Task's status to active.
3. WHEN a Task's status changes, THE App SHALL persist the updated Task_List to Storage before the next user-initiated action is processed.
4. WHILE a Task has completed status, THE App SHALL render its text with a strikethrough style and muted color (`#9ca3af`).

---

### Requirement 3: Delete Tasks

**User Story:** As a user, I want to delete tasks from the list, so that I can remove things I no longer need to track.

#### Acceptance Criteria

1. WHEN a user activates the Delete_Button on a Task, THE App SHALL remove that Task from the Task_List.
2. WHEN a Task is removed, THE App SHALL persist the updated Task_List to Storage before the next user-initiated action is processed.
3. WHILE the Task_List is empty, THE App SHALL display an empty-state message reading "Nothing to do. Add a task above." in place of the task list.
4. WHILE a Task item does not have pointer hover or keyboard focus, THE App SHALL keep the Delete_Button visually hidden but reachable via keyboard focus so it remains operable without a mouse.

---

### Requirement 4: Filter Tasks by Status

**User Story:** As a user, I want to filter the task list by status, so that I can focus on only the tasks relevant to me.

#### Acceptance Criteria

1. THE App SHALL provide three Filter options: `all`, `active`, and `completed`, where `active` means Tasks whose completed status is false and `completed` means Tasks whose completed status is true.
2. WHEN the App initializes, THE App SHALL apply the `all` Filter as the default active Filter.
3. WHEN a user selects the `all` Filter, THE App SHALL display all Tasks in the Task_List regardless of status.
4. WHILE the `active` Filter is the active Filter, THE App SHALL display only Tasks with completed status equal to false.
5. WHILE the `completed` Filter is the active Filter, THE App SHALL display only Tasks with completed status equal to true.
6. WHEN a Filter is selected, THE App SHALL visually indicate the active Filter using a non-text visual indicator (such as a border, background highlight, or underline) that is distinct from unselected Filter options.
7. WHEN a Filter is selected that matches no Tasks, THE App SHALL display an empty-state message reading "Nothing to do. Add a task above." in place of the task list.

---

### Requirement 5: Persist Tasks Across Page Refreshes

**User Story:** As a user, I want my tasks to be saved automatically, so that I don't lose them when I close or refresh the browser tab.

#### Acceptance Criteria

1. WHEN the App initializes, THE App SHALL load the Task_List from Storage and render it.
2. IF no data exists in Storage at initialization, THE App SHALL initialize with an empty Task_List.
3. WHEN any Task_List mutation occurs (add, toggle, delete), THE App SHALL serialize the Task_List as JSON and write it to Storage.
4. THE App SHALL store and retrieve the Task_List under a single, consistent Storage key used for both read and write operations throughout the App's lifetime.

---

### Requirement 6: Keyboard and Accessibility Support

**User Story:** As a user, I want to operate the app entirely by keyboard, so that I can use it without a mouse.

#### Acceptance Criteria

1. THE App SHALL ensure all interactive elements (Input_Field, Add_Button, Complete_Toggle, Delete_Button, Filter controls) are reachable via sequential keyboard navigation (Tab / Shift+Tab) and operable via Enter or Space keys.
2. THE App SHALL maintain visible focus rings on all interactive elements — focus outlines MUST NOT be removed without a visible replacement style applied to the focused element.
3. THE App SHALL provide an `aria-label` on any button that does not contain visible text.
4. THE App SHALL maintain a minimum contrast ratio of 4.5:1 for all interactive and primary text content against its background; decorative or secondary text (such as completed-task strikethrough text) SHALL maintain a minimum contrast ratio of 3:1 against its background.
