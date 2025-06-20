import React from 'react';
import { Navigate } from 'react-router-dom';

// userRole should be fetched from auth context or user state
const RoleProtectedRoute = ({ userRole, allowedRoles, children }) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RoleProtectedRoute;
