import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../reusable/BackButton';
import './Form.css';
import './Signup.css';


const MAX_NAME_LENGTH = 18;
const LETTERS_ONLY = /^[A-Za-z]*$/;

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.6 18.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Signup() {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const handleNameChange = (setter) => (e) => {
    const value = e.target.value;
    if (LETTERS_ONLY.test(value) && value.length <= MAX_NAME_LENGTH) {
      setter(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (!LETTERS_ONLY.test(username) || !LETTERS_ONLY.test(firstName) || !LETTERS_ONLY.test(lastName)) {
      setError('Username and name fields can only contain letters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const data = await signup({ username, firstName, lastName, email, password })
      localStorage.setItem('token', data.token)
      loginUser(data.user)
      navigate('/dashboard')
    } 
    catch (err) {
      setError(err.message)
    } 
    finally {
      setLoading(false)
    }
  };

  return (
    <div className="signup-wrapper page-enter">
      <form className="signup-card" onSubmit={handleSubmit}>
        <BackButton fallback="/" />
        <h2>Sign Up</h2>
        {error && <p className="form-error">{error}</p>}
        <label className="form-label" htmlFor="username">Username</label>
        <input 
        className="form-input" 
        id="username" 
        type="text" 
        value={username} 
        onChange={handleNameChange(setUsername)} 
        maxLength={MAX_NAME_LENGTH} 
        placeholder="janedoe" 
        />

        <label className="form-label" htmlFor="firstName">First Name</label>
        <input 
        className="form-input" 
        id="firstName" 
        type="text" 
        value={firstName} 
        onChange={handleNameChange(setFirstName)} 
        maxLength={MAX_NAME_LENGTH} 
        placeholder="Jane" 
        />

        <label className="form-label" htmlFor="lastName">Last Name</label>
        <input 
        className="form-input" 
        id="lastName" 
        type="text" 
        value={lastName} 
        onChange={handleNameChange(setLastName)} 
        maxLength={MAX_NAME_LENGTH} 
        placeholder="Doe" 
        />

        <label className="form-label" htmlFor="email">Email</label>
        <input 
        className="form-input" 
        id="email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="you@example.com" 
        />

        <label className="form-label" htmlFor="password">Password</label>
        <div className="form-password-wrapper">
          <input
            className="form-input"
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*********"
          />
          <button
            type="button"
            className="form-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showPassword} />
          </button>
          {password.length >0 && <PasswordLimit  password={password}/>}
        </div>

        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
        <div className="form-password-wrapper">
          <input
            className="form-input"
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="******"
          />
          <button
            type="button"
            className="form-password-toggle"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showConfirmPassword} />
          </button>
        </div>
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="form-switch">
          Already signed up? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;