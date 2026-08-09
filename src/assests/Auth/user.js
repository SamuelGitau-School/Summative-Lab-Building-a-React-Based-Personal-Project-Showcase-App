const API_BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

// Get the currently logged-in user's data 
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Could not fetch user.');
  return res.json()
}

// Update profile 
export async function updateProfile(updates) {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Could not update profile.');
  return res.json()
}

// Change password 
export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/users/me/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!res.ok) throw new Error('Could not change password.');
  return res.json()
}

// Admin-only: list all users
export async function getAllUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Could not fetch users.');
  return res.json()
}

// Admin-only: edit another user's fields 
export async function updateUser(userId, updates) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Could not update user.');
  return res.json()
}

// Admin-only: remove a user
export async function deleteUser(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Could not delete user.');
  return res.json()
}