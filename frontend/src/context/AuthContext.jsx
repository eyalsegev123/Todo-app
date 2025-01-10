import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage on component mount
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    // Store token without 'Bearer' prefix - we'll add it in the API calls
    localStorage.setItem('token', userData.token);
    
    const userToStore = {
      username: userData.username,
      email: userData.email,
      user_id: userData.user_id
    };
    
    localStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userToStore);
    
    console.log('Auth state updated:', {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    });
  };

  const logout = () => {
    // Clear both token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
