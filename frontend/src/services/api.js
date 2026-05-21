const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://placement-portal-six-ruddy.vercel.app/api';

const makeRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

const api = {
  get: (endpoint, options = {}) => makeRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => makeRequest(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options = {}) => makeRequest(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options = {}) => makeRequest(endpoint, { method: 'DELETE', ...options })
};

export default api;
export { API_BASE_URL };
