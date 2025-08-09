// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  } else {
    console.log("login data ---------------------",context);
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('pmtml_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, role,res) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation logic
      // if (
      //   (email === 'admin@gmail.com' && password === 'admin123' && role === 'admin') ||
      //   (email === 'user@gmail.com' && password === 'user123' && role === 'user')
      // ) {
      //   const mockUser = {
      //     id: '1',
      //     email,
      //     name: role === 'admin' ? 'Admin User' : 'Regular User',
      //     phone: '+1234567890',
      //     role,
      //   };

      //   setUser("test");
      //   localStorage.setItem('pmtml_user', JSON.stringify("test"));
      //   setIsLoading(false);
      //   return true;
      // } else {
      //   setIsLoading(false);
      //   return false;
      // }
      setUser(email);
      localStorage.setItem('pmtml_user', JSON.stringify("test"));
      localStorage.setItem('UserId', email.userId);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name, email, phone, password) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email,
        name,
        phone,
        role: 'user', // default role
      };
      setUser(mockUser);
      localStorage.setItem('pmtml_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pmtml_user');
    localStorage.removeItem('UserId');
    
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
