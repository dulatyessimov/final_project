// src/api/index.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Function to log an event
export const logEvent = async (eventType, details, userId) => {
  try {
    const response = await axios.post(`${API_URL}/logs`, {
      userId,
      eventType,
      details,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging event:', error);
    throw error;
  }
};

// Function to get the most viewed products analytics
export const getMostViewed = async () => {
  try {
    // For demo purposes, we set an admin header. In production, use proper auth.
    const response = await axios.get(`${API_URL}/analytics/most-viewed`, {
      headers: {
        'x-admin': 'true'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching most viewed analytics:', error);
    throw error;
  }
};
