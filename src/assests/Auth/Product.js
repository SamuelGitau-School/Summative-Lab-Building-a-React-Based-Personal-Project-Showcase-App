const API_BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

// Get all products
export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Could not fetch products.')
  return res.json()
}

// Admin-only: create a new product
export async function createProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error('Could not create product.')
  return res.json()
}

// Admin-only: edit a product's fields
export async function updateProduct(productId, updates) {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Could not update product.');
  return res.json()
}

// Admin-only: remove a product
export async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Could not delete product.')
  return res.json()
}