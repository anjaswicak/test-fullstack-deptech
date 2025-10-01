'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const savedToken = Cookies.get('token');
    const savedUser = Cookies.get('user');
    const savedRefreshToken = Cookies.get('refresh_token');
    
    if (savedToken && savedUser && savedRefreshToken) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        Cookies.remove('token');
        Cookies.remove('refresh_token');
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      
    // console.log(data,"response");
      // Save to cookies with refresh token
      Cookies.set('token', data.token, { expires: 1 }); // 1 day
      Cookies.set('refresh_token', data.refresh_token || data.token, { expires: 7 }); // 7 days
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 }); // 7 days
      
      // Update state
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear everything regardless of API call result
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      Cookies.remove('user');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};