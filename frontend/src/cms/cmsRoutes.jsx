import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const CmsRoutes = () => (
  <Routes>
    <Route path="/admin/login" element={<LoginPage />} />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default CmsRoutes;
