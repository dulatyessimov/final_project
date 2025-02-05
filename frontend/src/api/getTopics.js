import axios from 'axios';
import { getCurrentUser } from './auth';

axios.defaults.withCredentials = true;  // Ensure cookies (including tokens) are sent with the request

const API_URL = 'http://localhost:5000/api/topics';  // The API URL for fetching topics

let isRequestInProgress = false;  // Flag to prevent double submissions

// Function to handle the API request
const handleRequest = async (request) => {
  if (isRequestInProgress) {
    // Prevent double submission if a request is already in progress
    throw new Error('Request is already in progress');
  }

  try {
    isRequestInProgress = true;  // Mark request as in progress
    const response = await request();
    console.log("API Response:", response);  // Log the full response for debugging
    return response.data;  // Return the data from the response
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);  // Log any errors
    throw error.response?.data || { message: 'Invalid response from server' };  // Throw the error message
  } finally {
    isRequestInProgress = false;  // Reset the flag after request is complete
  }
};

// Get all topics (protected route)
export const getTopics = async () => {
  try {
    const response = await handleRequest(() => axios.get(API_URL, { withCredentials: true }));
    console.log("Fetched Topics:", response);  // Log fetched topics for debugging
    return response;  // Return topics data to be used in the calling component
  } catch (error) {
    console.error("Error fetching topics:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Unable to fetch topics' };  // Throw the error
  }
};

// Edit a topic (protected route)
export const editTopic = async (topicId, newTitle) => {
  try {
    const response = await handleRequest(() => axios.put(`${API_URL}/${topicId}`, { title: newTitle }, { withCredentials: true }));
    console.log("Edited Topic:", response);  // Log edited topic for debugging
    return response;  // Return updated topic data
  } catch (error) {
    console.error("Error editing topic:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Unable to edit topic' };  // Throw the error
  }
};

// Delete a topic (protected route)
export const deleteTopic = async (topicId) => {
  try {
    const response = await handleRequest(() => axios.delete(`${API_URL}/${topicId}`, { withCredentials: true }));
    console.log("Deleted Topic:", response);  // Log deleted topic for debugging
    return response;  // Return confirmation of deletion
  } catch (error) {
    console.error("Error deleting topic:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Unable to delete topic' };  // Throw the error
  }
};

// Function to add a new topic
export const addTopic = async (title) => {
  try {
    const user = await getCurrentUser();
    const token = user.token; // Get token from user data

    const response = await axios.post('http://localhost:5000/api/topics', { title }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding topic:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Error adding topic' };
  }
};