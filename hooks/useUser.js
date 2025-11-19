'use client';

import { useState, useEffect } from 'react';

export function useUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/auth/user/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users || data);
        setError(null);
      } catch (err) {
        console.error('[v0] Error fetching users:', err);
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUsersByRole = (role) => {
    return users.filter(user => user.role === role);
  };

  return {
    users,
    loading,
    error,
    getUsersByRole,
  };
}
