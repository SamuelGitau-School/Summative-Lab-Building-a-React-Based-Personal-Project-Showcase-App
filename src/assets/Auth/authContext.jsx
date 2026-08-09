import { createContext, useContext, useState, useEffect } from 'react';
import {getCurrentUser} from '../User/user'

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

    const loginUser =(userData) => (userData)

    const logoutUser = () => {
        setUser(null)
        localStorage.removeItem('token')
    }
    
    return(
    <AuthContext.Provider value={{user,loading,loginUser,logoutUser}}>
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