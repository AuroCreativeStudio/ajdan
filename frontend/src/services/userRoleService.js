const API_URL = 'http://localhost:1337/api';

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
}

export async function createUser(user) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchRoles() {
  const res = await fetch(`${API_URL}/users-permissions/roles`);
  return res.json();
}

export async function createRole(role) {
  const res = await fetch(`${API_URL}/users-permissions/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(role),
  });
  return res.json();
}

export async function updateRole(id, role) {
  const res = await fetch(`${API_URL}/users-permissions/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(role),
  });
  return res.json();
}

export async function deleteRole(id) {
  const res = await fetch(`${API_URL}/users-permissions/roles/${id}`, { method: 'DELETE' });
  return res.json();
}
