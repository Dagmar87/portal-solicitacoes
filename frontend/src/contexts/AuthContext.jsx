import { createContext, useContext, useState } from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');

      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('user');

      return null;
    }
  });

  async function login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password,
    });

    const { token, user } = response.data.data;

    localStorage.setItem('token', token);

    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
