import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, setToken, getProfile, updateProfile as updateProfileApi } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.token) {
      setToken(user.token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    const syncProfile = async () => {
      if (user?.token) {
        try {
          const { data } = await getProfile();
          setUser((prev) => ({ ...prev, ...data }));
        } catch {
          setUser(null);
        }
      }
    };
    syncProfile();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await loginUser(credentials);
      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await registerUser(credentials);
      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const { data } = await updateProfileApi(profileData);
    const mergedUser = { ...user, ...data };
    setUser(mergedUser);
    return mergedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setUser, setError, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
