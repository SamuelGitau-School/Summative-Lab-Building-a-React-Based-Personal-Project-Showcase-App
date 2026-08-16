import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { login } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext.jsx';

// Mock the API call so no real network request happens
vi.mock('../../utils/auth', () => ({
  login: vi.fn(),
}));

// Mock the auth context hook
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLogin() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login', () => {
  let loginUser;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    loginUser = vi.fn();
    useAuth.mockReturnValue({ loginUser });
  });

  it('renders email and password fields, and a submit button', () => {
    renderLogin();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders a link to the signup page', () => {
    renderLogin();
    const link = screen.getByRole('link', { name: 'Sign up' });
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('shows an error and does not call login when submitted with empty fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Please fill in both fields')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('shows an error and does not call login when only email is filled in', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Please fill in both fields')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('calls login with the entered credentials on submit', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 42, firstName: 'Wayne' },
    });

    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('user@example.com', 'hunter2');
    });
  });

  it('stores the token, user, and userId in localStorage on success', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 42, firstName: 'Wayne' },
    });

    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('userId')).toBe('42');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 42, firstName: 'Wayne' });
    });
  });

  it('calls loginUser from context with the returned user on success', async () => {
    const user = userEvent.setup();
    const userData = { id: 42, firstName: 'Wayne' };
    login.mockResolvedValue({ token: 'fake-token', user: userData });

    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith(userData);
    });
  });

  it('navigates to /dashboard on successful login', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 42, firstName: 'Wayne' },
    });

    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows a loading state while the request is in flight', async () => {
    const user = userEvent.setup();
    let resolveLogin;
    login.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      })
    );

    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('button', { name: 'Loading....' })).toBeDisabled();

    resolveLogin({ token: 't', user: { id: 1 } });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
  });

  it('displays the server error message and does not navigate on failed login', async () => {
    const user = userEvent.setup();
    login.mockRejectedValue(new Error('Invalid email or password'));

    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    expect(loginUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('re-enables the submit button after a failed login', async () => {
    const user = userEvent.setup();
    login.mockRejectedValue(new Error('Invalid email or password'));

    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).not.toBeDisabled();
    });
  });
});