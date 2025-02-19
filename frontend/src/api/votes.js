// src/api/votes.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/votes';

// Get vote count for a topic
export const getVotesByTopic = async (topicId) => {
  try {
    const response = await axios.get(`${API_URL}/topic/${topicId}`);
    return response.data; // Expected: { votes: <number> }
  } catch (error) {
    console.error('Error fetching votes:', error);
    throw error;
  }
};

// Upvote a topic
export const upvoteTopic = async (topicId) => {
  try {
    const response = await axios.post(
      `${API_URL}/topic/${topicId}/upvote`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error upvoting topic:', error);
    throw error;
  }
};

// Downvote (remove vote) from a topic
export const downvoteTopic = async (topicId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/topic/${topicId}/downvote`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error downvoting topic:', error);
    throw error;
  }
};
