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
    if (typeof renderTasks === 'function') renderTasks();

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
    if (typeof renderTasks === 'function') renderTasks();
  };

  const deleteTask = (id) => {
    const exists = tasks.some(t => t.id === id);
    if (!exists) return;

    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    if (typeof renderTasks === 'function') renderTasks();
  };

  const getFilteredTasks = () => {
    if (currentFilter === 'active') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks; // 'all'
  };

  const setFilter = (filter) => {
    currentFilter = filter;
    if (typeof renderTasks === 'function') renderTasks();
    if (typeof renderFilterButtons === 'function') renderFilterButtons();
  };

  // Expose internal state and functions for property-based testing.
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
    STORAGE_KEY,
  });
})();
