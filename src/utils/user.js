import { getCollection, setCollection } from '../data/Localdb'

const seedUsers = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin',
    firstName: 'Site',
    lastName: 'Admin',
    role: 'admin',
  },
]

export function getUsersCollection() {
  return getCollection('users', seedUsers)

}

export async function getCurrentUser() {
  const saved = localStorage.getItem('user')
  if (!saved) throw new Error('No user found.')
  return JSON.parse(saved)
}

export async function getAllUsers() {
  const users = getUsersCollection()
  return users.map(({ password, ...safeUser }) => safeUser)
}

export async function updateUser(userId, updates) {
  const users = getUsersCollection()
  const updated = users.map((u) => (u.id === userId ? { ...u, ...updates } : u))
  setCollection('users', updated)

  const match = updated.find((u) => u.id === userId)
  const { password, ...safeUser } = match
  return safeUser
}

export async function changePassword(userId, currentPassword, newPassword) {
  const users = getUsersCollection()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) throw new Error('User not found.')

  if (users[idx].password !== currentPassword) {
    throw new Error('Current password is incorrect.')
  }

  users[idx] = { ...users[idx], password: newPassword }
  setCollection('users', users)
  return { success: true }
}

export async function deleteUser(userId) {
  const users = getUsersCollection()
  setCollection('users', users.filter((u) => u.id !== userId))
  return { success: true }
}