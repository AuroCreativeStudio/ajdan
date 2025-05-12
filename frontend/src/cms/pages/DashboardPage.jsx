// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar'; // Import the new Sidebar component
import { logout } from '../../services/authService';

function Dashboard({ token, user }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login'); // redirect to login on logout
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} /> {/* Use the Sidebar component */}
      {/* Welcome Message */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Dashboard, <span className="text-blue-600">{user?.username || 'User'}</span>!
        </h1>
      </div>
    </div>
  );
}

export default Dashboard;
