import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { getCurrentUser } from '../utils/user';

vi.mock('../utils/user', () => ({
  getCurrentUser: vi.fn(),
}));

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

const fakeUser = { id: 1, name: 'Test', email: 'user@example.com', role: 'user' };

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('useAuth guard', () => {
    it('throws when used outside an AuthProvider', () => {
      // React logs the thrown render error; silence it so the run stays readable.
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderHook(() => useAuth())).toThrow(
        /must be used within an AuthProvider/i
      );

      spy.mockRestore();
    });
  });

  describe('rehydration on mount', () => {
    it('finishes loading without a user when no token is stored', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeNull();
      expect(getCurrentUser).not.toHaveBeenCalled();
    });

    it('stays in a loading state while the profile request is in flight', async () => {
      localStorage.setItem('token', 'abc123');
      // A promise that never settles keeps the hook pinned mid-flight.
      getCurrentUser.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it('loads the user when a token is present and the request succeeds', async () => {
      localStorage.setItem('token', 'abc123');
      getCurrentUser.mockResolvedValue(fakeUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result.current.user).toEqual(fakeUser);
      expect(localStorage.getItem('token')).toBe('abc123');
    });

    it('clears the stored token when the profile request fails', async () => {
      localStorage.setItem('token', 'expired-token');
      getCurrentUser.mockRejectedValue(new Error('401 Unauthorized'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('only attempts rehydration once', async () => {
      localStorage.setItem('token', 'abc123');
      getCurrentUser.mockResolvedValue(fakeUser);

      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));
      rerender();
      rerender();

      expect(getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('loginUser', () => {
    it('puts the user into context', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => result.current.loginUser(fakeUser));

      expect(result.current.user).toEqual(fakeUser);
    });
  });

  describe('logoutUser', () => {
    it('clears the user and removes the token', async () => {
      localStorage.setItem('token', 'abc123');
      getCurrentUser.mockResolvedValue(fakeUser);

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.user).toEqual(fakeUser));

      act(() => result.current.logoutUser());

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('is safe to call when nobody is logged in', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(() => act(() => result.current.logoutUser())).not.toThrow();
      expect(result.current.user).toBeNull();
    });
  });

  describe('updateUserContext', () => {
    it('replaces the user in context', async () => {
      localStorage.setItem('token', 'abc123');
      getCurrentUser.mockResolvedValue(fakeUser);

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.user).toEqual(fakeUser));

      const updated = { ...fakeUser, name: 'Updated User' };
      act(() => result.current.updateUserContext(updated));

      expect(result.current.user).toEqual(updated);
    });

    it('mirrors the updated user into localStorage', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const updated = { ...fakeUser, name: 'Updated User' };
      act(() => result.current.updateUserContext(updated));

      expect(JSON.parse(localStorage.getItem('user'))).toEqual(updated);
    });
  });
});