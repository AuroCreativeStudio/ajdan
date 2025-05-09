const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export const login = async (identifier, password) => {
  const res = await fetch(`${API_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Login failed');
  }

  const data = await res.json();
  localStorage.setItem('token', data.jwt);
  return data;
};

export const getToken = () => localStorage.getItem('token');

export const logout = () => {
  localStorage.removeItem('token');
};
