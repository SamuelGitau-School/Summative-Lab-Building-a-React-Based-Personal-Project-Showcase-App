import { useState } from "react";
import './components/Form page/Form.css'

function Signup (){
    const [firstName,setFirstName] = useState ('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [password,setPassword] = useState ('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')

        if (!email || !password || !confirmPassword){
            setError ('Please fill all fields')
            return
        }
        
        if (!password || !confirmPassword){
            setError('Passwords dont match')
            return
        }

        setLoading(true)
        try{
            const data =await Signup()
            localStorage.setItem('token',data.token)
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
                <h2>SIGN UP</h2>
            </form>
        </div>
    )


}

export default Signup