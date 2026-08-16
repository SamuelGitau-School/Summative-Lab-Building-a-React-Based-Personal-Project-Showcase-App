import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Landing from './pages/landing/Landing.jsx';
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/Signup.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx'
import AdminPanel from './pages/admin/AdminPanel.jsx';
import ProductDetail from './pages/products/ProductDetails.jsx'
import Cart from './pages/cart/Cart.jsx'
import Wishlist from './pages/wishlist/Wishlist.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>

      {/* <Route path="/browse" element={<ProtectedRoute><Products /></ProtectedRoute>} /> */}

      <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>}/>

      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>}/>

      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>}/>

      <Route path="/admin"  element={<ProtectedRoute adminOnly> <AdminPanel /></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;