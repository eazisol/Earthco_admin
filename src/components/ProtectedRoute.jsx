import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    // Redirect to register page if not authenticated
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute; 