// authContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (token) => {
    try {
      setToken(token);
      sessionStorage.setItem('token', token);
    } catch (error) {
      console.error('Failed to save token', error);
    }
  };

  const logout = () => {
    try {
      setToken(null);
      sessionStorage.removeItem('token');
    } catch (error) {
      console.error('Failed to remove token', error);
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
