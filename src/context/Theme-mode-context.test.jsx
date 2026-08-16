import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeModeProvider, useThemeMode } from './ThemeContext';


function ThemeConsumer() {
  const { mode, toggleColorMode } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggleColorMode}>Toggle</button>
    </div>
  );
}

function mockMatchMedia(prefersDark) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: prefersDark,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('ThemeModeProvider / useThemeMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useThemeMode outside a provider', () => {
    it('throws a helpful error', () => {

      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => renderHook(() => useThemeMode())).toThrow(
        'useThemeMode must be used within a ThemeModeProvider'
      );
      spy.mockRestore();
    });
  });

  describe('initial mode', () => {
    it('uses the saved localStorage value when present, ignoring system preference', () => {
      localStorage.setItem('theme', 'dark');
      mockMatchMedia(false); 

      render(
        <ThemeModeProvider>
          <ThemeConsumer />
        </ThemeModeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    });

    it('falls back to system preference (dark) when nothing is saved', () => {
      mockMatchMedia(true);

      render(
        <ThemeModeProvider>
          <ThemeConsumer />
        </ThemeModeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    });

    it('falls back to system preference (light) when nothing is saved', () => {
      mockMatchMedia(false);

      render(
        <ThemeModeProvider>
          <ThemeConsumer />
        </ThemeModeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('light');
    });
  });

  describe('side effects on mode', () => {
    it('sets the data-theme attribute on <html> to match the mode', () => {
      localStorage.setItem('theme', 'dark');
      mockMatchMedia(false);

      render(
        <ThemeModeProvider>
          <ThemeConsumer />
        </ThemeModeProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('persists the mode to localStorage', () => {
      localStorage.setItem('theme', 'light');
      mockMatchMedia(false);

      render(
        <ThemeModeProvider>
          <ThemeConsumer />
        </ThemeModeProvider>
      );

      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('toggleColorMode', () => {
    it('flips the mode from light to dark and back, updating the DOM and localStorage each time', async () => {
      const user = userEvent.setup();
      localStorage.setItem('theme', 'light');
      mockMatchMedia(false);

      render(
        <ThemeModeProvider>
          <ThemeConsumer />
        </ThemeModeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('light');

      await user.click(screen.getByRole('button', { name: 'Toggle' }));
      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      await user.click(screen.getByRole('button', { name: 'Toggle' }));
      expect(screen.getByTestId('mode')).toHaveTextContent('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });
});