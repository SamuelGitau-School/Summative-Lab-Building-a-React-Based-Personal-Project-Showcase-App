import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './assets/Route/ Protectedroute'
import Landing from './components/Landing page/Landing'
import Login from './components/Form page/Login/Login'
import Signup from './components/Form page/Sign up/Sign-up'
import Dashboard from './components/Dashboard/Dashboard'
import AdminPanel from './components/Dashboard/AdminPanel/AdminPanel'
import ProductDetail from './components/Product-page/Product-detail/Product-detail'
import Cart from './components/Cart/Cart'
import Wishlist from './components/Drop-Down/Wishlist/Wishlist'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

      <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>}/>

      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>}/>

      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>}/>

      <Route path="/admin"  element={<ProtectedRoute adminOnly> <AdminPanel /></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;