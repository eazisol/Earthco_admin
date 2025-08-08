import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
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
const [loginUser,setLoginUser] = useState(null);
const [rolePermission, setRolePermission] = useState([]);
useEffect(() => {
  const user = localStorage.getItem('user');
  if (user) {
    setLoginUser(JSON.parse(user));
  }
}, []);
 

  const value = {
    setLoginUser,
    loginUser,
    rolePermission,
    setRolePermission
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 