import axios from 'axios';

axios.defaults.withCredentials = true; // Allow sending cookies with requests

const API_URL = 'http://localhost:5000/api/auth';
let isRequestInProgress = false;  // Track if request is in progress

// Handle API request errors
const handleRequest = async (request) => {
  if (isRequestInProgress) {
    // If request is already in progress, prevent double submission
    throw new Error('Request is already in progress');
  }

  try {
    isRequestInProgress = true;  // Mark request as in progress
    const response = await request();
    console.log("API Response:", response); // Log full response
    return response.data; 
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Invalid response from server' };
  } finally {
    isRequestInProgress = false;  // Reset the flag after request is complete
  }
};

// Register function
export const register = (username, email, password) => 
  handleRequest(() => axios.post(`${API_URL}/register`, { username, email, password }, { withCredentials: true }));

// Login function
export const login = (email, password) => 
  handleRequest(() => axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true }));

// Logout function
export const logout = () => 
  handleRequest(() => axios.post(`${API_URL}/logout`, {}, { withCredentials: true }));

// Get current user info (protected route)
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
    console.log("Current User Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Unable to fetch user data' };
  }
};
