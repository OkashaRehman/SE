import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};