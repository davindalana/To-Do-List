/**
 * run-tests.js — Node.js headless runner for tests.html property suite.
 *
 * Simulates the browser environment used in tests.html:
 *  - mock localStorage
 *  - minimal DOM stubs (querySelector, querySelectorAll, createElement)
 *  - window.__TODO_TEST_MODE__ = true
 *  - crypto.randomUUID
 *
 * Does NOT test axe-core (requires a real browser DOM).
 */

'use strict';

const fs = require('fs');
const vm = require('vm');

// ── 1. Mock localStorage ─────────────────────────────────────────────────────
const _store = {};
const _mockStorage = {
  getItem: (k) => (k in _store ? _store[k] : null),
  setItem: (k, v) => { _store[k] = String(v); },
  removeItem: (k) => { delete _store[k]; },
  clear: () => { for (const k in _store) delete _store[k]; },
};

// ── 2. Minimal DOM simulation ─────────────────────────────────────────────────
//
// app.js calls:
//   document.querySelector('#task-list')
//   document.querySelector('#empty-state')
//   document.querySelectorAll('.filter-btn')
//   document.querySelector('#task-input')
//   document.createElement(tag)
//   document.addEventListener('DOMContentLoaded', cb)
//
// tests.html P8/P10 call:
//   document.querySelector('#empty-state')
//   document.querySelectorAll('#task-list li')
//   document.querySelectorAll('button')
//
// We build a minimal in-memory DOM sufficient for these operations.

class FakeElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.type = '';
    this.className = '';
    this.checked = false;
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.style = {};
    this.dataset = {};
    this._attrs = {};
    this._children = [];
    this._listeners = {};
    // for #empty-state
    this._id = '';
  }

  get id() { return this._id; }
  set id(v) { this._id = v; }

  setAttribute(name, val) { this._attrs[name] = String(val); }
  getAttribute(name) { return this._attrs[name] ?? null; }

  classList = (() => {
    const el = this;
    return {
      _classes: new Set(),
      add(c) { el.className = [...this._classes.add(c) || this._classes].join(' '); this._sync(); },
      remove(c) { this._classes.delete(c); this._sync(); },
      contains(c) { return this._classes.has(c); },
      _sync() { el.className = [...this._classes].join(' '); },
    };
  })();

  appendChild(child) { this._children.push(child); return child; }

  addEventListener(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
  }

  // querySelectorAll and querySelector for the task-list container
  querySelectorAll(sel) {
    return _querySelectorAll(this, sel);
  }
  querySelector(sel) {
    const res = _querySelectorAll(this, sel);
    return res[0] ?? null;
  }

  // innerHTML setter: clear children
  set innerHTML(v) {
    this._innerHTML = v;
    if (v === '') this._children = [];
  }
  get innerHTML() { return this._innerHTML || ''; }

  focus() {}
}

// Registry of elements by id and by selector patterns
const _elementsById = {};
const _elementsByClass = {};

// Global task-list and empty-state elements (reused across renders)
const _taskList = new FakeElement('ul');
_taskList._id = 'task-list';
_elementsById['task-list'] = _taskList;

const _emptyState = new FakeElement('p');
_emptyState._id = 'empty-state';
_emptyState.style = {};
_elementsById['empty-state'] = _emptyState;

const _taskInput = new FakeElement('input');
_taskInput._id = 'task-input';
_elementsById['task-input'] = _taskInput;

const _addBtn = new FakeElement('button');
_addBtn._id = 'add-btn';
_elementsById['add-btn'] = _addBtn;

const _filterBtns = ['all', 'active', 'completed'].map((f) => {
  const b = new FakeElement('button');
  b.className = 'filter-btn';
  b.dataset.filter = f;
  b.textContent = f.charAt(0).toUpperCase() + f.slice(1);
  return b;
});
_elementsByClass['filter-btn'] = _filterBtns;

// Helpers
function _querySelectorAll(root, sel) {
  // For test use we only need a few patterns:
  if (sel === '#task-list li' || sel === 'li') {
    // children of task-list
    return _taskList._children.filter(c => c.tagName === 'LI');
  }
  if (sel === '#empty-state') return [_emptyState];
  if (sel === 'button') {
    // Collect filter buttons + delete buttons rendered inside task-list
    const deleteBtns = _taskList._children.flatMap(li =>
      li._children.filter(c => c.tagName === 'BUTTON')
    );
    return [..._filterBtns, ...deleteBtns, _addBtn];
  }
  if (sel === '.filter-btn') return _filterBtns;
  if (sel === '#task-input') return [_taskInput];
  if (sel === '#add-btn') return [_addBtn];
  return [];
}

let _domContentLoadedCb = null;

const _document = {
  querySelector(sel) {
    if (sel === '#task-list') return _taskList;
    if (sel === '#empty-state') return _emptyState;
    if (sel === '#task-input') return _taskInput;
    if (sel === '#add-btn') return _addBtn;
    if (sel === '.filter-section') return null; // no filter section in test env
    return null;
  },
  querySelectorAll(sel) {
    return _querySelectorAll(null, sel);
  },
  createElement(tag) {
    const el = new FakeElement(tag);
    // classList needs to reference el properly
    const classSet = new Set();
    el.classList = {
      add(c) { classSet.add(c); el.className = [...classSet].join(' '); },
      remove(c) { classSet.delete(c); el.className = [...classSet].join(' '); },
      contains(c) { return classSet.has(c); },
      _set: classSet,
    };
    return el;
  },
  addEventListener(event, cb) {
    if (event === 'DOMContentLoaded') _domContentLoadedCb = cb;
  },
};

// ── 3. Set up the VM context ─────────────────────────────────────────────────

const appSrc = fs.readFileSync('app.js', 'utf8');
const fcSrc = fs.readFileSync('fast-check.umd.js', 'utf8');

const context = vm.createContext({
  // Browser globals
  window: {
    __TODO_TEST_MODE__: true,
    __TODO_INTERNALS__: undefined,
  },
  document: _document,
  localStorage: _mockStorage,
  crypto: {
    randomUUID: () => {
      // Simple UUID v4 implementation
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },
  },
  Date,
  JSON,
  Math,
  Array,
  Object,
  String,
  Number,
  Boolean,
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Promise,
  // Node globals needed by fast-check
  require,
  module: { exports: {} },
  exports: {},
  fc: undefined, // will be set by fast-check UMD
});

// Mirror window.__TODO_TEST_MODE__ so app.js IIFE sees it
context.window.__TODO_TEST_MODE__ = true;

// Run app.js — this immediately executes the IIFE
vm.runInContext(appSrc, context);

// After app.js runs, __TODO_INTERNALS__ should be set on window
const internals = context.window.__TODO_INTERNALS__;
if (!internals) {
  console.error('FATAL: window.__TODO_INTERNALS__ not set after loading app.js');
  process.exit(1);
}

// Load fast-check into context
vm.runInContext(fcSrc, context);
const fc = context.fc;
if (!fc || typeof fc.assert !== 'function') {
  console.error('FATAL: fast-check did not load correctly');
  process.exit(1);
}

// ── 4. Test helpers ──────────────────────────────────────────────────────────

const { getTasks, setTasks, addTask, toggleTask, deleteTask,
        getFilteredTasks, setCurrentFilter, loadTasks, renderTasks,
        renderFilterButtons, STORAGE_KEY } = internals;

const resetState = () => {
  setTasks([]);
  _mockStorage.clear();
};

const readStoredTasks = () => {
  const raw = _mockStorage.getItem(STORAGE_KEY);
  try { return raw !== null ? JSON.parse(raw) : null; } catch { return null; }
};

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const results = [];

const run = (title, fn) => {
  try {
    fn();
    results.push({ title, passed: true });
    console.log(`  ✓  ${title}`);
  } catch (err) {
    results.push({ title, passed: false, detail: err.message ?? String(err) });
    console.log(`  ✗  ${title}`);
    console.log(`     ${(err.message ?? String(err)).split('\n')[0]}`);
  }
};

console.log('\nTo Do List — Property-Based Tests (Node headless runner)\n');

// ── P1: Valid task addition grows the task list ──────────────────────────────
run('P1 — Valid task addition grows the task list', () => {
  const validDescription = fc.string({ minLength: 1, maxLength: 500 }).filter(
    (s) => s.trim().length >= 1 && s.trim().length <= 500
  );
  fc.assert(
    fc.property(validDescription, (description) => {
      resetState();
      const before = getTasks().length;
      addTask(description);
      const after = getTasks();
      if (after.length !== before + 1) return false;
      const lastTask = after[after.length - 1];
      if (lastTask.description !== description.trim()) return false;
      return true;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P2: Invalid input rejected, list unchanged ───────────────────────────────
run('P2 — Invalid input rejected, list unchanged', () => {
  const invalidDescription = fc.oneof(
    fc.string({ minLength: 0, maxLength: 100 }).map((s) => s.replace(/\S/g, ' ')),
    fc.string({ minLength: 501, maxLength: 600 }).filter((s) => s.trim().length > 500)
  );
  fc.assert(
    fc.property(invalidDescription, (description) => {
      resetState();
      const before = getTasks().length;
      addTask(description);
      const after = getTasks().length;
      return after === before;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P3: Toggle round-trip ────────────────────────────────────────────────────
run('P3 — Toggle round-trip (toggle twice = no change)', () => {
  const taskRecord = fc.record({
    id: fc.uuidV(4),
    description: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    completed: fc.boolean(),
    createdAt: fc.integer({ min: 0 }),
  });
  const taskArrayAndIndex = fc
    .array(taskRecord, { minLength: 1 })
    .chain((arr) =>
      fc.tuple(fc.constant(arr), fc.integer({ min: 0, max: arr.length - 1 }))
    );
  fc.assert(
    fc.property(taskArrayAndIndex, ([taskArray, index]) => {
      resetState();
      const copy = taskArray.map((t) => ({ ...t }));
      setTasks(copy);
      const target = getTasks()[index];
      const originalCompleted = target.completed;
      toggleTask(target.id);
      toggleTask(target.id);
      const afterTask = getTasks().find((t) => t.id === target.id);
      return afterTask !== undefined && afterTask.completed === originalCompleted;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P4: Delete removes task ──────────────────────────────────────────────────
run('P4 — Delete removes task', () => {
  const taskRecord = fc.record({
    id: fc.uuidV(4),
    description: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    completed: fc.boolean(),
    createdAt: fc.integer({ min: 0 }),
  });
  const taskArrayArb = fc.array(taskRecord, { minLength: 1 });
  fc.assert(
    fc.property(taskArrayArb, fc.integer({ min: 0 }), (taskArray, rawIndex) => {
      resetState();
      setTasks([...taskArray]);
      const index = rawIndex % taskArray.length;
      const deletedId = taskArray[index].id;
      const before = getTasks().length;
      deleteTask(deletedId);
      const after = getTasks();
      if (after.length !== before - 1) return false;
      if (after.some((t) => t.id === deletedId)) return false;
      return true;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P5: Mutation persistence round-trip ─────────────────────────────────────
run('P5 — Mutation persistence round-trip', () => {
  const validDesc = fc
    .string({ minLength: 1, maxLength: 500 })
    .filter((s) => s.trim().length >= 1 && s.trim().length <= 500);
  const mutationArb = fc.oneof(
    fc.record({ kind: fc.constant('add'), description: validDesc }),
    fc.record({ kind: fc.constant('toggle') }),
    fc.record({ kind: fc.constant('delete') })
  );
  const mutationSequenceArb = fc.array(mutationArb, { minLength: 1, maxLength: 10 });
  fc.assert(
    fc.property(mutationSequenceArb, (mutations) => {
      resetState();
      for (const mutation of mutations) {
        if (mutation.kind === 'add') {
          addTask(mutation.description);
        } else if (mutation.kind === 'toggle') {
          const current = getTasks();
          if (current.length === 0) continue;
          toggleTask(current[0].id);
        } else {
          const current = getTasks();
          if (current.length === 0) continue;
          deleteTask(current[0].id);
        }
        const stored = readStoredTasks();
        const inMemory = getTasks();
        if (stored === null) return false;
        if (!deepEqual(stored, inMemory)) return false;
      }
      return true;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P6: "all" filter returns every task ─────────────────────────────────────
run('P6 — "all" filter returns every task', () => {
  const taskRecord = fc.record({
    id: fc.uuidV(4),
    description: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    completed: fc.boolean(),
    createdAt: fc.integer({ min: 0 }),
  });
  const taskArrayArb = fc.array(taskRecord, { minLength: 0, maxLength: 20 });
  fc.assert(
    fc.property(taskArrayArb, (taskArray) => {
      resetState();
      setTasks(taskArray.map((t) => ({ ...t })));
      setCurrentFilter('all');
      return getFilteredTasks().length === getTasks().length;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P7: Status filters show only matching tasks ──────────────────────────────
run('P7 — Status filters show only matching tasks', () => {
  const taskRecord = fc.record({
    id: fc.uuidV(4),
    description: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    completed: fc.boolean(),
    createdAt: fc.integer({ min: 0 }),
  });
  const taskArrayArb = fc.array(taskRecord, { minLength: 0, maxLength: 20 });
  fc.assert(
    fc.property(taskArrayArb, fc.constantFrom('active', 'completed'), (taskArray, filter) => {
      resetState();
      setTasks(taskArray.map((t) => ({ ...t })));
      setCurrentFilter(filter);
      const result = getFilteredTasks();
      if (filter === 'active') return result.every((t) => t.completed === false);
      else return result.every((t) => t.completed === true);
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P8: Empty filter result shows empty state ────────────────────────────────
run('P8 — Empty filter result shows empty state', () => {
  const taskRecord = fc.record({
    id: fc.uuidV(4),
    description: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    completed: fc.boolean(),
    createdAt: fc.integer({ min: 0 }),
  });
  const scenarioA = fc
    .array(taskRecord, { minLength: 0, maxLength: 10 })
    .map((arr) => arr.map((t) => ({ ...t, completed: true })))
    .map((arr) => ({ taskArray: arr, filter: 'active' }));
  const scenarioB = fc
    .array(taskRecord, { minLength: 0, maxLength: 10 })
    .map((arr) => arr.map((t) => ({ ...t, completed: false })))
    .map((arr) => ({ taskArray: arr, filter: 'completed' }));
  fc.assert(
    fc.property(fc.oneof(scenarioA, scenarioB), ({ taskArray, filter }) => {
      resetState();
      setTasks(taskArray.map((t) => ({ ...t })));
      setCurrentFilter(filter);
      renderTasks();
      const emptyState = _emptyState;
      const listItems = _taskList._children.filter(c => c.tagName === 'LI');
      if (emptyState.style.display !== 'block') return false;
      if (listItems.length !== 0) return false;
      return true;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P9: Initialization loads the persisted task list ────────────────────────
run('P9 — Initialization loads the persisted task list', () => {
  const taskArb = fc.record({
    id: fc.uuidV(4),
    description: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length >= 1),
    completed: fc.boolean(),
    createdAt: fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
  });
  const taskArrayArb = fc.array(taskArb, { minLength: 0, maxLength: 20 });
  fc.assert(
    fc.property(taskArrayArb, (storedTasks) => {
      _mockStorage.clear();
      _mockStorage.setItem(STORAGE_KEY, JSON.stringify(storedTasks));
      setTasks([]);
      loadTasks();
      return deepEqual(getTasks(), storedTasks);
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── P10: Buttons without visible text have aria-label ───────────────────────
run('P10 — Buttons without visible text have aria-label', () => {
  const taskRecord = fc.record({
    id: fc.uuidV(4),
    description: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    completed: fc.boolean(),
    createdAt: fc.integer({ min: 0 }),
  });
  const taskArrayArb = fc.array(taskRecord, { minLength: 0, maxLength: 10 });
  fc.assert(
    fc.property(taskArrayArb, (taskArray) => {
      for (const filter of ['all', 'active', 'completed']) {
        resetState();
        setTasks(taskArray.map((t) => ({ ...t })));
        setCurrentFilter(filter);
        renderTasks();

        // Collect all buttons in the test container: filter-btns + delete buttons.
        // Note: tests.html does NOT include #add-btn in its hidden test-dom-container,
        // so document.querySelectorAll('button') in the real browser only sees these.
        const deleteBtns = _taskList._children.flatMap((li) =>
          li._children.filter((c) => c.tagName === 'BUTTON')
        );
        const buttons = [..._filterBtns, ...deleteBtns];

        for (const btn of buttons) {
          if ((btn.textContent ?? '').trim() === '') {
            const label = btn.getAttribute('aria-label');
            if (!label || label.trim() === '') return false;
          }
        }
      }
      return true;
    }),
    { numRuns: 100, seed: 42 }
  );
});

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n─────────────────────────────────────────────');
const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('FAILURES:');
  results
    .filter((r) => !r.passed)
    .forEach((r) => {
      console.log(`\n  ✗  ${r.title}`);
      console.log(`     ${r.detail}`);
    });
  process.exit(1);
} else {
  console.log('All property tests passed ✓');
  process.exit(0);
}
