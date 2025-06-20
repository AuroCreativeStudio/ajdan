import React, { useEffect, useState } from 'react';
import { createUser, updateUser, fetchUsers, fetchRoles } from '../../services/userRoleService';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '', role: '' });
  const [roles, setRoles] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

useEffect(() => {
  fetchRoles().then(data => {
    console.log("Fetched roles:", data); // Optional: for debugging

    let rolesArr = [];
    if (Array.isArray(data?.roles)) {
      // Your actual response structure
      rolesArr = data.roles.map(r => ({
        id: r.id,
        name: r.name
      }));
    } else {
      console.error("Unexpected roles structure", data);
    }
    setRoles(rolesArr);
  });

  if (id) {
    fetchUsers().then(users => {
      const found = users.find(u => u.id === parseInt(id));
      if (found) setUser({ ...found, role: found.role?.id });
    });
  }
}, [id]);


  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) await updateUser(id, user);
    else await createUser(user);
    navigate('/userlist');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <input name="username" value={user.username} onChange={handleChange} placeholder="Username" className="block mb-2 w-full" required />
      <input name="email" value={user.email} onChange={handleChange} placeholder="Email" className="block mb-2 w-full" required />
      {!id && <input name="password" type="password" value={user.password} onChange={handleChange} placeholder="Password" className="block mb-2 w-full" required />}
      <select name="role" value={user.role} onChange={handleChange} className="block mb-2 w-full" required>
        <option value="">Select Role</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{id ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default UserForm;
