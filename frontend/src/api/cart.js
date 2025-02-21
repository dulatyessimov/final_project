import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart';

// Add product to shopping cart (pending order)
export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(
      `${API_URL}/cart/add`,
      { productId, quantity },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch the shopping cart (pending order)
export const getCart = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the shopping cart
export const updateCart = async (products, totalCost) => {
  try {
    const response = await axios.put(
      `${API_URL}/cart`,
      { products, totalCost },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Checkout: update order status from Pending to Processing
export const checkoutCart = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/checkout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a specific cart item
export const deleteCartItem = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/item/${productId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
