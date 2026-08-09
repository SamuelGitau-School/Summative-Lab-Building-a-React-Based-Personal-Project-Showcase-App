import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './assests/Auth/ Protectedroute.jsx'
import Login from './components/Form page/Login/Login.jsx'
import Signup from './components/Form page/Sign up/Sign-up.jsx'
import Dashboard from './components/Dashboard/AdminPanel/Dashboard.jsx'
import AdminPanel from './components/Dashboard/AdminPanel/AdminPanel.jsx'
import './App.css'

function App() {

  return (
    <Route>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>

      <Route path='/dashboard' element ={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path='/admin' element={<ProtectedRoute><AdminPanel/></ProtectedRoute>}/> 
      
    </Route>
  )
}

export default App
