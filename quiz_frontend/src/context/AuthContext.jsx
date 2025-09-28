import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=> {
    const raw = localStorage.getItem('quizzo_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
  }, []);

  const login = async ({ username, password }) => {
    const res = await api.post('user/login/', { username, password });
    // adjust according to backend response structure:
    const { access, refresh, user: userId } = res.data.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    const userObj = { id: userId, username };
    localStorage.setItem('quizzo_user', JSON.stringify(userObj));
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    setUser(userObj);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('quizzo_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);