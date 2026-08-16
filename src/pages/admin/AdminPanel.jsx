import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { getAllUsers, deleteUser, updateUser } from '../../utils/user';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/product';
import BackButton from '../../components/reusable/BackButton';

function AdminPanel() {
  const [tab, setTab] = useState('users');

  return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: 'left' }}>
      <BackButton />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
        <Typography variant="h4" sx={{ color: 'var(--text-h)' }}>
          Admin Panel
        </Typography>
        <Button size="small" component={Link} to="/dashboard">
          Switch to User Dashboard
        </Button>
      </Box>

      <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} sx={{ mb: 3 }}>
        <Tab value="users" label="Users" />
        <Tab value="products" label="Products" />
      </Tabs>

      {tab === 'users' ? <UsersSection /> : <ProductsSection />}
    </Container>
  );
}

function UsersSection() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { loadUsers()}, [])

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin'
    try {
      const updated = await updateUser(user.id, { role: newRole })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Typography variant="body2" sx={{ color: 'var(--text)' }}>
        {users.length} user{users.length !== 1 ? 's' : ''}
      </Typography>

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 0 }}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            sx={{
              border: '1px solid var(--border)',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'var(--accent-bg)' },
            }}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => handleRoleToggle(user)}>
                  {user.role === 'admin' ? 'Demote' : 'Promote'}
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </Stack>
            }
          >
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ color: 'var(--text-h)' }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === 'admin' ? 'primary' : 'default'}
                  />
                </Stack>
              }
              secondary={user.email}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

function ProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')

  useEffect(() => { loadProducts()}, [])

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
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
        setProducts((prev) => [...prev, created])
      } else {
        const updated = await updateProduct(editingId, {
          name: formName,
          price: Number(formPrice),
        })
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)))
      }
      cancelForm()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'var(--text)' }}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </Typography>
        {!editingId && (
          <Button size="small" variant="contained" onClick={startAdd}>
            Add Product
          </Button>
        )}
      </Box>

      {editingId && (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            label="Product name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            size="small"
            label="Price"
            type="number"
            value={formPrice}
            onChange={(e) => setFormPrice(e.target.value)}
            sx={{ flex: '1 1 120px' }}
          />
          <Button type="submit" variant="contained">
            {editingId === 'new' ? 'Add' : 'Save'}
          </Button>
          <Button type="button" onClick={cancelForm}>Cancel</Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={6} sm={4} md={3} key={product.id}>
            <Card>
              <CardContent className="flex flex-col gap-2">
                <Typography variant="subtitle1" sx={{ color: 'var(--text-h)' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--accent)' }}>
                  ${Number(product.price).toFixed(2)}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" onClick={() => startEdit(product)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default AdminPanel