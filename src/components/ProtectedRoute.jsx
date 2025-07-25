import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token && user.token.data) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute; 