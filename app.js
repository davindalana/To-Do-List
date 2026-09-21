(() => {
  const STORAGE_KEY = 'todo-tasks';
  let tasks = [];
  let currentFilter = 'all';

  // Expose internals for property-based testing only.
  // The test harness sets `window.__TODO_TEST_MODE__ = true` before loading this script.
  const _expose = (obj) => {
    if (typeof window !== 'undefined' && window.__TODO_TEST_MODE__) {
      window.__TODO_INTERNALS__ = obj;
    }
  };

  // ── Storage ────────────────────────────────────────────────────────────────

  const loadTasks = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch {
      tasks = [];
    }
  };

  const saveTasks = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // storage quota exceeded or unavailable — in-memory state remains valid
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────

  const getFilteredTasks = () => {
    if (currentFilter === 'active') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks; // 'all'
  };

  // ── DOM Rendering ──────────────────────────────────────────────────────────

  /**
   * Creates a single <li> task element for the given task object.
   * Requirements: 2.4, 3.4, 6.1, 6.3
   */
  const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', task.description);
    checkbox.dataset.id = task.id;

    const span = document.createElement('span');
    span.textContent = task.description;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.dataset.id = task.id;
    deleteBtn.textContent = '✕';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
  };

  /**
   * Clears and rebuilds #task-list from the current filtered tasks.
   * Toggles the #empty-state message based on whether the list is empty.
   * Requirements: 3.3, 4.3, 4.4, 4.5, 4.7
   */
  const renderTasks = () => {
    const list = document.querySelector('#task-list');
    const emptyState = document.querySelector('#empty-state');
    if (!list || !emptyState) return;

    const filtered = getFilteredTasks();
    list.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filtered.forEach(task => list.appendChild(createTaskElement(task)));
    }
  };

  /**
   * Syncs the active CSS class on filter buttons to match currentFilter.
   * Requirements: 4.2, 4.6
   */
  const renderFilterButtons = () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.dataset.filter === currentFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // ── Mutations ──────────────────────────────────────────────────────────────

  const addTask = (description) => {
    const trimmed = description.trim();
    if (trimmed.length === 0 || trimmed.length > 500) return;

    const task = {
      id: crypto.randomUUID() ?? Date.now().toString(),
      description: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    const input = document.querySelector('#task-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  };

  const deleteTask = (id) => {
    const exists = tasks.some(t => t.id === id);
    if (!exists) return;

    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  };

  const setFilter = (filter) => {
    currentFilter = filter;
    renderTasks();
    renderFilterButtons();
  };

  // ── Expose internals for test harness ─────────────────────────────────────

  _expose({
    getTasks: () => tasks,
    setTasks: (arr) => { tasks = arr; },
    getCurrentFilter: () => currentFilter,
    setCurrentFilter: (f) => { currentFilter = f; },
    addTask,
    toggleTask,
    deleteTask,
    getFilteredTasks,
    setFilter,
    loadTasks,
    saveTasks,
    createTaskElement,
    renderTasks,
    renderFilterButtons,
    STORAGE_KEY,
  });

  // ── Initialization ─────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    renderFilterButtons();

    const input = document.querySelector('#task-input');
    const addBtn = document.querySelector('#add-btn');
    const taskList = document.querySelector('#task-list');
    const filterSection = document.querySelector('.filter-section');

    // Guard: these elements are only present in index.html, not in the test harness
    if (addBtn && input) {
      addBtn.addEventListener('click', () => addTask(input.value));

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask(input.value);
      });
    }

    // Delegated: checkbox toggle
    if (taskList) {
      taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
          toggleTask(e.target.dataset.id);
        }
      });

      // Delegated: delete button
      taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
          deleteTask(e.target.dataset.id);
        }
      });
    }

    // Delegated: filter buttons
    if (filterSection) {
      filterSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
          setFilter(e.target.dataset.filter);
        }
      });
    }
  });
})();
