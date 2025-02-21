// src/api/votes.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/votes';

// Get vote count for a Product
export const getVotesByProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}`);
    return response.data; // Expected: { votes: <number> }
  } catch (error) {
    console.error('Error fetching votes:', error);
    throw error;
  }
};

// Upvote a Product
export const upvoteProduct = async (productId) => {
  try {
    const response = await axios.post(
      `${API_URL}/product/${productId}/upvote`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error upvoting Product:', error);
    throw error;
  }
};

// Downvote (remove vote) from a Product
export const downvoteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/product/${productId}/downvote`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error downvoting Product:', error);
    throw error;
  }
};
