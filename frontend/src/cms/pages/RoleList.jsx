import React, { useEffect, useState } from 'react';
import { fetchRoles, deleteRole } from '../../services/userRoleService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await fetchRoles();
                console.log("Fetched roles:", data);

                if (Array.isArray(data.roles)) {
                    const rolesArr = data.roles.map(r => ({
                        id: r.id,
                        name: r.name,
                        description: r.description,
                    }));
                    setRoles(rolesArr);
                } else {
                    console.error("Unexpected roles structure:", data);
                    setRoles([]);
                }
            } catch (err) {
                console.error("Error fetching roles:", err);
            }
        };

        loadRoles();
    }, []);



    const handleDelete = async (id) => {
        if (window.confirm('Delete role?')) {
            await deleteRole(id);
            setRoles(roles.filter(r => r.id !== id));
        }
    };

    return (
            <div className="flex h-screen bg-white ">
                <div className="w-64"></div>
                <div className="flex-1">
                    <div className="flex items-center justify-between w-full mb-6">
                        <h1 className="text-3xl font-headline text-gray-800">Roles</h1>
                        <div className="flex items-center space-x-4">
                        </div>
                        <button onClick={() => navigate('/role-create')} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Create Role</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-headline">Name</th>
                                    <th scope="col" className="px-6 py-3 font-headline">Description</th>
                                    <th scope="col" className="px-6 py-3 font-headline">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(roles) ? roles : []).map(r => (
                                    <tr key={r.id}>
                                        <td className="px-6 py-4">{r.name}</td>
                                        <td className="px-6 py-4">{r.description}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => navigate(`/role-edit/${r.id}`)} className="mr-2 text-blue-600">Edit</button>
                                            <button onClick={() => handleDelete(r.id)} className="text-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ToastContainer />
                </div>
            </div>
    );
};

export default RoleList;
