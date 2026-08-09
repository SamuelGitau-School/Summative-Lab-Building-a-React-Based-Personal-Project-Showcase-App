import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from '../../../assets/Auth/auth'
import { useAuth } from "../../../assets/Auth/authContext"
import '../Form.css'


function Login(){

  const navigate = useNavigate()
  const {loginUser} = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError('')

    if (!email || !password){
      setError('Please fill in both fields')
        return
      }

    setLoading(true)
      try{
        const data = await login(email, password)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('userId', data.user.id)
        loginUser(data.user)
        navigate('/dashboard')
      }
      catch(err){
        setError(err.message)
      }
      finally{
        setLoading(false)
      }
  }

  return(
    <div className="form-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <h1>LOG IN</h1>{error && <p className="form-error">{error}</p>}

        <label  className="form-label" htmlFor="email">Email</label>
          <input 
          className="form-input"
          id="email"
          type="email" 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="your@example.com"
          />
                
        <label className="form-label" htmlFor="password">Password</label>
          <input 
          className="form-input"
          id="password"
          type="password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="********"
          />

        <button className="form-button" type="submit" disabled={loading}>
          {loading ? 'Loading....' : 'Login'}
        </button>

        <p className="form-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  )

}

export default Login