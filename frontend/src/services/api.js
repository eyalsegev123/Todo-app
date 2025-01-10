import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('Current token:', token); // Debug log
  if (!token) {
    throw new Error('No authentication token found');
  }
  // Add 'Bearer' prefix here
  return { 
    Authorization: `Bearer ${token.replace('Bearer ', '')}`, // Remove any existing Bearer prefix
    'Content-Type': 'application/json'
  };
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
    throw error.response?.data?.error || error.message;
  }
};

export const createTask = async (taskData) => {
  try {
    const headers = getAuthHeader();
    console.log('Making request with:', {
      url: `${API_URL}/tasks`,
      headers,
      data: taskData
    });

    const response = await axios.post(`${API_URL}/tasks`, taskData, { headers });
    return response.data;
  } catch (error) {
    console.error('Create task error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      originalError: error
    });
    throw error.response?.data?.error || error.message;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

