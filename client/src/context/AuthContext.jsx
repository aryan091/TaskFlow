import React, { createContext, useContext, useState } from 'react';
import { registerUser, loginUser } from '../utils/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );

  const register = async (name, email, password) => {
    try {
      const newUser = await registerUser(name, email, password);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { data: newUser }; // Return the registered user
    } catch (error) {
      return { error: error.message }; // Return error response
    }
  };

  const login = async (email, password) => {
    try {
      const user = await loginUser(email, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      return { data: user }; 
    } catch (error) {
      console.error('Login error:', error.message);
      
      return { error: error.message }; 
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
