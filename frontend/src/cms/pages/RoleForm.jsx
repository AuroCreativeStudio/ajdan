import React, { useEffect, useState } from 'react';
import { createRole, updateRole, fetchRoles } from '../../services/userRoleService';
import { useNavigate, useParams } from 'react-router-dom';

const RoleForm = () => {
  const [role, setRole] = useState({ name: '', description: '' });
  const { id } = useParams();
  const navigate = useNavigate();

useEffect(() => {
  if (id) {
    fetchRoles().then(data => {
      const roles = data.roles; // ✅ extract the array
      const found = roles.find(r => r.id === parseInt(id));
      if (found) {
        setRole({
          name: found.name || '',
          description: found.description || ''
        });
      }
    });
  }
}, [id]);


  const handleChange = e => setRole({ ...role, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) await updateRole(id, role);
    else await createRole(role);
    navigate('/rolelist');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <input name="name" value={role.name} onChange={handleChange} placeholder="Role Name" className="block mb-2 w-full" required />
      <input name="description" value={role.description} onChange={handleChange} placeholder="Description" className="block mb-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{id ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default RoleForm;
