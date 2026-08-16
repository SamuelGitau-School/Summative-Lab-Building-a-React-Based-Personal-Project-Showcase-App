import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Signup from '../components/auth/Signup';
import { signup } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

jest.mock('../../utils/auth', () => ({ signup: jest.fn() }));
jest.mock('../../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../reusable/BackButton', () => () => <div>BackButton</div>);
jest.mock('../reusable/Passwaord-input', () => () => <div>PasswordLimit</div>);

const renderSignup = () => {
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );
};

const fillForm = async (user) => {
  await user.type(screen.getByLabelText('Username'), 'janedoe');
  await user.type(screen.getByLabelText('First Name'), 'Jane');
  await user.type(screen.getByLabelText('Last Name'), 'Doe');
  await user.type(screen.getByLabelText('Email'), 'jane@example.com');
  await user.type(screen.getByLabelText('Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm Password'), 'password123');
};

describe('Signup Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ loginUser: jest.fn() });
  });

  test('renders the form', () => {
    renderSignup();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  test('shows an error on empty submit', async () => {
    const user = userEvent.setup();
    renderSignup();

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Please fill in all fields.')).toBeInTheDocument();
  });

  test('shows an error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderSignup();

    await fillForm(user);
    await user.clear(screen.getByLabelText('Confirm Password'));
    await user.type(screen.getByLabelText('Confirm Password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
  });

  test('navigates to dashboard on successful signup', async () => {
    const user = userEvent.setup();
    signup.mockResolvedValueOnce({ token: 'mockToken', user: { id: 1 } });
    renderSignup();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows an error message when signup fails', async () => {
    const user = userEvent.setup();
    signup.mockRejectedValueOnce(new Error('Signup failed'));
    renderSignup();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Signup failed')).toBeInTheDocument();
  });
});

