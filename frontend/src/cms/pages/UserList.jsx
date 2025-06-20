import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../../services/userRoleService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete user?')) {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="flex h-screen bg-white ">
            <div className="w-64"></div>
            <div className="flex-1">
                <div className="flex items-center justify-between w-full mb-6">
                    <h1 className="text-3xl font-headline text-gray-800">Users</h1>
                    <div className="flex items-center space-x-4">
                    </div>
                    <button onClick={() => navigate('/user-create')} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Create User</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-headline">Name</th>
                                <th scope="col" className="px-6 py-3 font-headline">Email</th>
                                <th scope="col" className="px-6 py-3 font-headline">Role</th>
                                <th scope="col" className="px-6 py-3 font-headline">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="px-6 py-4">{u.username}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">{u.role?.name}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => navigate(`/user-edit/${u.id}`)} className="mr-2 text-blue-600">Edit</button>
                                        <button onClick={() => handleDelete(u.id)} className="text-red-600">Delete</button>
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

export default UserList;
