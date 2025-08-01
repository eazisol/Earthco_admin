import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const RoleBasedRoute = ({ children }) => {
  const { loginUser } = useAppContext();
  
  // Check if user is logged in
  if (!loginUser || !loginUser.token || !loginUser.token.data) {
    return <Navigate to="/login" replace />;
  }

  // If user has RoleId 2, allow them to stay on the same page (do not redirect)
  // So, just render the children for all roles (including RoleId 2)
  return children;
};

export default RoleBasedRoute; 