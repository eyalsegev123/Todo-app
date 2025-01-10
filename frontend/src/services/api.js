import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return { 
    Authorization: `Bearer ${token.replace('Bearer ', '')}`,
    'Content-Type': 'application/json'
  };
};

// Add this function to handle token expiration
const handleTokenExpiration = async (error) => {
  if (error.response?.data?.isExpired) {
    // Only clear token and redirect if it's specifically an expired token
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Session expired. Please login again.');
  }
  // For all other errors, just throw them normally
  throw error.response?.data?.error || error.message;
};

export const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      const { token, user } = response.data;
  
      // Return token and updated user object
      return {
        token,
        username: user.username, // Changed from 'name' to 'username'
        email: user.email,
        user_id: user.user_id,
      };
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  };
  
  

export const register = async (userData) => {
try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data; // Success message
} catch (err) {
    throw err.response?.data?.error || err.message || 'Unknown error occurred';
}
};

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    return handleTokenExpiration(error);
  }
};

export const createTask = async (taskData) => {
  try {
    const headers = getAuthHeader();
    const response = await axios.post(`${API_URL}/tasks`, taskData, { headers });
    return response.data;
  } catch (error) {
    return handleTokenExpiration(error);
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    return handleTokenExpiration(error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    return handleTokenExpiration(error);
  }
};

