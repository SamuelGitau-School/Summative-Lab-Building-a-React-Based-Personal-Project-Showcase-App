import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

function ProtectedRoute({childern,adminOnly = false}){
    const {user,loading} = useAuth()

    if (loading){
        return <p>Loading...</p>
    }
    if(!user){
        return <Navigate to="/login" replace/>
    }
    if(adminOnly && user.role !== 'admin'){
        return <Navigate to="/" replace/>
    }
    return childern
}

export default ProtectedRoute