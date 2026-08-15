import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.login({ email, password });
    if (response.status === 'Success' || response.token) {
      const activeToken = response.token;
      const activeUser = response.profile || response.user;
      localStorage.setItem('token', activeToken);
      localStorage.setItem('user', JSON.stringify(activeUser));
      setToken(activeToken);
      setUser(activeUser);
      return response;
    }
    throw new Error(response.error || 'Authentication failed');
  };

  const register = async (name, email, password, role, phone) => {
    const response = await api.register({ name, email, password, role, phone });
    if (response.status === 'Success' || response.token) {
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
      }
      return response;
    }
    throw new Error(response.error || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
