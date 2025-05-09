import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div>
      <h1>CMS Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* Add CMS forms and editors here */}
    </div>
  );
};

export default DashboardPage;
