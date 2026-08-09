const API_BASE = '/api'

function authHeaders() { 
    const token = localStorage.getItem('token')
    return { Authorization: `Bearer ${token}` };
}

export async function getCurrentUser() {
    const res =await fetch(`${API_BASE}/users/me`,{
        header : authHeaders()
    })

    if(!res.ok)throw new Error('Could not fetch user.')
    return res.json()

}

export async function updateProfile(updates) {
    const res = await fetch (`${API_BASE}/users/me`,{
        method :'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates),
    })

    if (!res.ok)throw new Error ('Could not update profile.')
    return res.json()
}

export async function changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/users/me/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!res.ok) throw new Error('Could not change password.')
    return res.json();
}

export async function getAllUsers() {
    const res = await fetch (`${API_BASE}/users`,{
        headers : authHeaders()
    })
    if(!res.ok)throw new Error('Could not fetch users.')
}

export async function deleteUser(userId) {
    const res = await fetch (`${API_BASE}/users/${userId}`,{
        method : 'DELETE',
        headers : authHeaders(),
    })

    if (!res.ok)throw new Error ('Could not delete user.')
    return res.json()
}