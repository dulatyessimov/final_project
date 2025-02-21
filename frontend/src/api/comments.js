// src/api/comments.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/comments';

// Get all comments for a Product
export const getCommentsByProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Add a new comment to a Product
export const addComment = async (productId, commentText) => {
  try {
    const response = await axios.post(
      `${API_URL}/product/${productId}/add`,
      { commentText },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Edit a comment
export const editComment = async (commentId, commentText) => {
  try {
    const response = await axios.put(
      `${API_URL}/edit/${commentId}`,
      { commentText },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/delete/${commentId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
