<<<<<<< HEAD
// This file runs once before each test file, via Vitest's `setupFiles`
// config option (see vite.config.js's `test.setupFiles`).
import { vi } from 'vitest';

// Aliases the global `jest` object to Vitest's `vi`, so test files written
// against the Jest API (jest.fn(), jest.mock(), jest.clearAllMocks(), etc.)
// keep working without being rewritten to use `vi` directly.
global.jest = vi;

// Adds custom matchers like .toBeInTheDocument(), .toHaveTextContent(),
// .toBeDisabled(), etc. Without this, assertions like
// `expect(x).toBeInTheDocument()` used throughout AdminPanel.test.jsx and
// Dashboard.test.jsx would throw "toBeInTheDocument is not a function".
import '@testing-library/jest-dom';

// Automatically unmounts and cleans up rendered components after each test.
// Without this, a component left mounted from one test can leak into the
// next test's DOM, causing false positives/negatives (e.g. a duplicate
// "Ada Lovelace" node matching in a later test that never rendered it).
// Note: RTL does this automatically since v9 if you're on a recent version —
// this line is a no-op safety net in that case, but harmless either way.
import { cleanup } from '@testing-library/react';
afterEach(() => {
  cleanup();
});

// jsdom (Jest's simulated browser) does not implement window.matchMedia.
// MUI's theme/breakpoint system (used by Stack's `direction={{ xs, sm }}`
// prop in Dashboard.jsx, and internally by components like Tabs) calls
// matchMedia under the hood. Without this mock, rendering AdminPanel or
// Dashboard throws "matchMedia is not a function".
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),    
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom also does not implement ResizeObserver. MUI components that measure
// their own size (Tabs' scroll buttons, Grid, etc.) use it internally.
// Without this mock, you'd see "ResizeObserver is not defined".
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom does not implement scrollIntoView. MUI's Tabs component (used in
// AdminPanel.jsx) calls this when switching tabs. Without this mock, clicking
// the "Products" tab in AdminPanel.test.jsx would throw
// "scrollIntoView is not a function".
window.HTMLElement.prototype.scrollIntoView = jest.fn();
=======
import '@testing-library/jest-dom';
>>>>>>> 58355c02a7a67855aa932875f7d0a65c45a99578
