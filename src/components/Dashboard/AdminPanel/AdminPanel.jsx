import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser} from '../../../assests/Auth/user'
import {getProducts, createProduct, updateProduct, deleteProduct, } from '../../../assests/Auth/Product'
import './AdminPanel.css'

function AdminPanel() {
  const [tab, setTab] = useState('users')
  return (
    <div className="admin-panel">
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

      {tab === 'users' ? <UsersSection /> : <ProductsSection />}
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {loadUsers()}, [])

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllUsers()
      setUsers(data);
    } 
    catch (err) {
      setError(err.message)
    } 
    finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) 
        return
    try {
      await deleteUser(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } 
    catch (err) {
      setError(err.message)
    }
  }

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin'
    try {
      const updated = await updateUser(user.id, { role: newRole })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
    } 
    catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-section">
      {error && <p className="admin-error">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleRoleToggle(user)}>
                  {user.role === 'admin' ? 'Demote to customer' : 'Promote to admin'}
                </button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')

  useEffect(() => {loadProducts()}, [])

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProducts()
      setProducts(data);
    } 
    catch (err) {
      setError(err.message)
    } 
    finally {
      setLoading(false)
    }
  }

  const startAdd = () => {
    setEditingId('new')
    setFormName('')
    setFormPrice('')
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setFormName(product.name)
    setFormPrice(product.price)
  }

  const cancelForm = () => {
    setEditingId(null)
    setFormName('')
    setFormPrice('')
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formName || !formPrice) {
      setError('Please fill in both fields.')
      return
    }

    try {
      if (editingId === 'new') {
        const created = await createProduct({ name: formName, price: Number(formPrice) });
        setProducts((prev) => [...prev, created]);
      } else {
        const updated = await updateProduct(editingId, {
          name: formName,
          price: Number(formPrice),
        });
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      }
      cancelForm();
    } catch (err) {
      setError(err.message);
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) 
        return
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } 
    catch (err) {
      setError(err.message)
    }
  };

  if (loading) return <p>Loading products...</p>

  return (
    <div className="admin-section">
      {error && <p className="admin-error">{error}</p>}

      {editingId ? (
        <form className="admin-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Product name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={formPrice}
            onChange={(e) => setFormPrice(e.target.value)}
          />
          <button type="submit">{editingId === 'new' ? 'Add' : 'Save'}</button>
          <button type="button" onClick={cancelForm}>Cancel</button>
        </form>
      ) : (
        <button onClick={startAdd}>Add Product</button>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>
                <button onClick={() => startEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel