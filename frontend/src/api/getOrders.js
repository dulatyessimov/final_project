// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/orders';

// export const getOrders = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     throw error;
//   }
// };

// export const getOrderById = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     throw error;
//   }
// };

// export const addOrder = async (orderData) => {
//   try {
//     const response = await axios.post(`${API_URL}/add`, orderData, {
//       withCredentials: true
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error adding order:', error);
//     throw error;
//   }
// };

// export const updateOrder = async (id, updateData) => {
//   try {
//     const response = await axios.put(`${API_URL}/edit/${id}`, updateData, {
//       withCredentials: true
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating order:', error);
//     throw error;
//   }
// };

// export const deleteOrder = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/delete/${id}`, {
//       withCredentials: true
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting order:', error);
//     throw error;
//   }
// };
