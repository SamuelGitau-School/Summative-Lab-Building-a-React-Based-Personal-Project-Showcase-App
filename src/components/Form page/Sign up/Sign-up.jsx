import { useState } from "react";
import '../Form.css'
import {auth} from '../../../assests/Auth/auth'

const LETTERS_ONLY = /^[A-Za-z]*$/
const MAX_NAME_LENGTH = 18

function Signup (){
    const [firstName,setFirstName] = useState ('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [password,setPassword] = useState ('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    const handleNameChange = (setter) => (e) =>{
        const value = e.target.value
        
        if (LETTERS_ONLY.test(value) && value.length <= MAX_NAME_LENGTH) {
            setter(value);

        }
    }
    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')

        if (!firstName ||!lastName ||!userName ||!email || !password || !confirmPassword ){
            setError ('Please fill all fields')
            return
        }

        if(!LETTERS_ONLY.test(userName) || !LETTERS_ONLY.test(firstName) || !LETTERS_ONLY.test(lastName)){
            setError ('Name field can only contain letters')
            return
        }

        if(userName.length > MAX_NAME_LENGTH || firstName.length > MAX_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH){
            setError (` fields must be ${MAX_NAME_LENGTH} characters or fewer.`)
        }
        
        if (!password || !confirmPassword){
            setError('Passwords dont match')
            return
        }

        setLoading(true)
        try{
            const data =await Signup({userName,password,firstName,lastName,email})
            localStorage.setItem('token',data.token)
            // redirect, update auth context, etc.
            // navigate('/dashboard');
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
            <form action="form" onSubmit={handleSubmit}>
                <h2>SIGN UP</h2>{error && <p className="form-error">{error}</p>}

                <label className="form-lablel" htmlFor="firstName">First Name</label>
                <input 
                className="form-input"
                id="firstName"
                type="text" 
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                placeholder="John"
                />

                <label className="form-lablel" htmlFor="lastName">Last Name</label>
                <input 
                className="form-input"
                id="lastName"
                type="text" 
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                placeholder="Doe"
                />

                <label className="form-lablel" htmlFor="userName">Username</label>
                <input 
                className="form-input"
                id="userName"
                type="text" 
                value={userName}
                onChange={(e)=>setUserName(e.target.value)}
                placeholder="JohnDoe"
                />

                <label  className="form-label" htmlFor="email">Email</label>
                <input 
                className="form-input"
                id="email"
                type="email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="your@example.com"
                />

                <label className="form-lablel" htmlFor="password">Password</label>
                <input 
                className="form-input"
                id="password"
                type="password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="********"
                />

                <label className="form-lablel" htmlFor="confirmPassword">Confirm Password</label>
                <input 
                className="form-input"
                id="confirmPassword"
                type="confirmPassword" 
                value={confirmPassword}
                onChange={(e)=>setconfirmPassword(e.target.value)}
                placeholder="********"
                />

                <button className="form-button" type="submit" disabled={loading}>
                    {loading ? 'Loading....' : 'Signing up'} </button>
            </form>
        </div>
    )


}

export default Signup