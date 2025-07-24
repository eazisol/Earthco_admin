import React, { createContext, useContext, useEffect, useState } from 'react';

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
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const [loginUser,setLoginUser] = useState(null);
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };
useEffect(() => {
  const user = localStorage.getItem('user');
 
  if (user) {
    setLoginUser(JSON.parse(user));
  }
}, []);
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loginUser,
    setLoginUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 