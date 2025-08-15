import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCurrentUser, clearUserAndRedirect } from '../utils/authUtils';

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }) => {
  const [loginUser, setLoginUser] = useState(null);
  const [rolePermission, setRolePermission] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setLoginUser(user);
    } else {
      setLoginUser(null);
    }
  }, []);

  const logout = () => {
    setLoginUser(null);
    setRolePermission([]);
    localStorage.removeItem('user');
    // Add a small delay to allow toast message to display
    setTimeout(() => {
      // toast.success('Logged out successfully');
      window.location.href = '/login';
      
    }, 10);
  };

  const value = {
    setLoginUser,
    loginUser,
    rolePermission,
    setRolePermission,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 