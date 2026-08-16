import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Replace the real context with a controllable stub.
// The path string must match the import inside ProtectedRoute.jsx exactly.
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

/**
 * Renders the guard at /dashboard with landmark routes at the two
 * redirect targets, so a redirect is observable as a change in
 * rendered output rather than something we have to spy on.
 */
function renderGuard({ adminOnly = false } = {}) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={adminOnly}>
              <p>Dashboard content</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/" element={<p>Landing page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('waits while auth resolves, without redirecting', () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    renderGuard();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
    // Guards against the classic bug: flashing the login page for a
    // split second before a logged-in session finishes rehydrating.
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('redirects to /login when there is no user', () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    renderGuard();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });

  it('renders children for an authenticated user', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Test', role: 'user' },
      loading: false,
    });

    renderGuard();

    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });

  it('redirects a non-admin away from an adminOnly route', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Test', role: 'user' },
      loading: false,
    });

    renderGuard({ adminOnly: true });

    expect(screen.getByText('Landing page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });

  it('renders children for an admin on an adminOnly route', () => {
    useAuth.mockReturnValue({
      user: { id: 2, name: 'Admin', role: 'admin' },
      loading: false,
    });

    renderGuard({ adminOnly: true });

    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });

  it('treats a missing role as non-admin', () => {
    useAuth.mockReturnValue({ user: { id: 3, name: 'No role' }, loading: false });

    renderGuard({ adminOnly: true });

    expect(screen.getByText('Landing page')).toBeInTheDocument();
  });
});