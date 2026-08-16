import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser, updateUser} from '../../utils/user'
import {getProducts, createProduct, updateProduct, deleteProduct, } from '../../utils/product'
import BackButton from '../../components/reusable/BackButton'
import './AdminPanel.css'
 
function AdminPanel() {
  const [tab, setTab] = useState('users')
  return (
    <div className="admin-panel page-enter">
      <BackButton />
      <Link to="/dashboard" className="admin-switch-link">Switch to User Dashboard</Link>
      <h1>Admin Panel</h1>
 
      <div className="admin-tabs">
        <button
          className={tab === 'users' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setTab('users')}
        >
          Users
        </button>
        <button
          className={tab === 'products' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setTab('products')}
        >
          Products
        </button>
      </div>
    </div>
  )
}

export default AdminPanel