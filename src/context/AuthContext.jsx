import { createContext, useContext, useState, useEffect } from 'react';
import {getCurrentUser} from '../utils/user'

const AuthContext = createContext(null)

export function AuthProvider({children}){
    const [user,setUser] = useState (null)
    const [loading, setLoading] = useState (true)

    useEffect(() =>{
        const token = localStorage.getItem('token')
        if (!token){
            setLoading(false)
            return
        }

        getCurrentUser ()
            .then((data)=> setUser(data))
            .catch(()=>{
                localStorage.removeItem('token')
                setUser(null)
            })
            .finally(()=> setLoading(false))
    },
    [])

    const loginUser = (userData) => setUser(userData)

    const logoutUser = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    // Keeps the in-memory user (and the localStorage copy authContext
    // rehydrates from on refresh) in sync after a profile edit.
    const updateUserContext = (updatedUser) => {
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
    }

    return(
    <AuthContext.Provider value={{user,loading,loginUser,logoutUser,updateUserContext}}>
    {children}
    </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}