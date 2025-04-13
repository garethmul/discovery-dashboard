import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authApi.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

export default ProtectedRoute; 