import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const RoleBasedRoute = ({ children }) => {
  const { loginUser } = useAppContext();
  
  // Check if user is logged in
  if (!loginUser || !loginUser.token || !loginUser.token.data) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role (RoleId !== 2)
  if (loginUser?.Data?.RoleId === 2) {
    // Show toast notification and redirect to dashboard
    // useEffect(() => {
    //   toast.error("Access denied. You don't have permission to view this page.");
    // }, []);
    
    return;
  }

  // User has admin access, render the component
  return children;
};

export default RoleBasedRoute; 