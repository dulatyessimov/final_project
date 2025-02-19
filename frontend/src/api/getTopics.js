import axios from 'axios';

// Set the base URL for the API
const API_URL = 'http://localhost:5000/api/topics';

// Function to fetch all topics
export const getTopics = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

// Function to fetch a single topic by ID
export const getTopicById = async (topicId) => {
  try {
    const response = await axios.get(`${API_URL}/${topicId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topic:', error);
    throw error;
  }
};

// Function to add a new topic
export const addTopic = async (title, content) => {
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      { title, content },
      { withCredentials: true } // Send authentication cookies (JWT)
    );
    return response.data;
  } catch (error) {
    console.error('Error adding topic:', error);
    throw error;
  }
};

// Function to update a topic
export const editTopic = async (topicId, title, content) => {
  try {
    const response = await axios.put(
      `${API_URL}/edit/${topicId}`,
      { title, content },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
};

// Function to delete a topic by ID
export const deleteTopic = async (topicId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${topicId}`, {
      withCredentials: true, // Send authentication cookies (JWT)
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
};
