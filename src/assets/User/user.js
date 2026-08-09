import { getCollection, setCollection } from '../../Database/db/Localdb';

export async function getCurrentUser() {
  const saved = localStorage.getItem('user')
  if (!saved) throw new Error('No user found.')
  return JSON.parse(saved)
}

export async function getAllUsers() {
  const users = getCollection('users', [])
  return users.map(({ password, ...safeUser }) => safeUser)
}

export async function updateUser(userId, updates) {
  const users = getCollection('users', [])
  const updated = users.map((u) => (u.id === userId ? { ...u, ...updates } : u))
  setCollection('users', updated)

  const match = updated.find((u) => u.id === userId)
  const { password, ...safeUser } = match
  return safeUser
}

export async function deleteUser(userId) {
  const users = getCollection('users', [])
  setCollection('users', users.filter((u) => u.id !== userId))
  return { success: true }
}