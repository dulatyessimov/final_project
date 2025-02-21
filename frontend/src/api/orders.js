import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

// Fetch orders for the current user with status "Processing" or "Completed"
export const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/user-orders`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the order status for a given order
export const updateOrderStatus = async (orderId, orderStatus) => {
  try {
    const response = await axios.put(
      `${API_URL}/edit/${orderId}`,
      { orderStatus },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
