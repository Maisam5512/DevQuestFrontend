
// Get API base URL - safe runtime access
function getAPIBaseURL() {
  return 'http://localhost:4000/api';
}

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('devQuestUserToken') : null;
  const baseURL = getAPIBaseURL();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (err) {
    throw err;
  }
};

// ===== AUTH API =====
export const authAPI = {
  register: (userData) =>
    apiCall('/auth/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiCall('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    apiCall('/auth/user/me', {
      method: 'GET',
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ===== BADGE API =====
export const badgeAPI = {
  getAll: () =>
    apiCall('/badge', {
      method: 'GET',
    }),

  getById: (id) =>
    apiCall(`/badge/${id}`, {
      method: 'GET',
    }),
};

