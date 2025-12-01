import { useState, useEffect, useCallback } from 'react';

// API Base URL - Update this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('devQuestUserToken') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ===========================
  // REGISTER USER
  // ===========================
  const registerUser = useCallback(async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.devQuestUserToken);
      localStorage.setItem('devQuestUserToken', data.devQuestUserToken);

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================
  // LOGIN USER
  // ===========================
  const loginUser = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      console.log("the data is:" , data);
      setUser(data.user);
      setToken(data.devQuestUserToken);
      localStorage.setItem('devQuestUserToken', data.devQuestUserToken);

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================
  // GET LOGGED-IN USER (ME)
  // ===========================
  const getMe = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      setUser(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setToken(null);
      localStorage.removeItem('devQuestUserToken');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ===========================
  // GET ALL USERS
  // ===========================
  const getAllUsers = useCallback(async () => {
    if (!token) {
      setError('Not authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    setUsersLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      setUsers(data.users || []);
      return { success: true, data: data.users || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUsersLoading(false);
    }
  }, [token]);

  // ===========================
  // GET CLIENT USERS
  // ===========================
  const getClientUsers = useCallback(async () => {
    const result = await getAllUsers();
    if (result.success) {
      const filtered = result.data.filter(user => user.role === 'client');
      return { success: true, data: filtered };
    }
    return result;
  }, [getAllUsers]);

  // ===========================
  // GET PM USERS
  // ===========================
  const getPmUsers = useCallback(async () => {
    const result = await getAllUsers();
    if (result.success) {
      const filtered = result.data.filter(user => user.role === 'pm');
      return { success: true, data: filtered };
    }
    return result;
  }, [getAllUsers]);

  // ===========================
  // GET DEVELOPER USERS
  // ===========================
  const getDeveloperUsers = useCallback(async () => {
    const result = await getAllUsers();
    console.log(result);
    if (result.success) {
      const filtered = result.data.filter(user => user.role === 'developer');
      return { success: true, data: filtered };
    }
    return result;
  }, [getAllUsers]);

  // ===========================
  // FILTER USERS BY ROLE
  // ===========================
  const filterUsersByRole = useCallback((role) => {
    return users.filter(user => user.role === role);
  }, [users]);

  // ===========================
  // LOGOUT
  // ===========================
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setUsers([]);
    setError(null);
    localStorage.removeItem('authToken');
  }, []);

  // Fetch user on mount or when token changes
  useEffect(() => {
    if (token && !user) {
      getMe();
    }
  }, [token, user, getMe]);

  return {
    // State
    user,
    token,
    loading,
    error,
    users,
    usersLoading,

    // Auth Functions
    registerUser,
    loginUser,
    logout,
    getMe,

    // User Fetching
    getAllUsers,
    getClientUsers,
    getPmUsers,
    getDeveloperUsers,
    filterUsersByRole,

    // Helpers
    isAuthenticated: !!token,
  };
};

export default useAuth;
