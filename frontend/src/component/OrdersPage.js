import React, { useState, useEffect } from 'react';
import { getUserOrders, updateOrderStatus } from '../api/orders';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      setError('Error fetching orders.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status to "Cancelled"
  const handleCancelOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Cancelled');
      fetchOrders();
    } catch (err) {
      setError('Error cancelling order.');
    }
  };

  // Update order status to "Completed"
  const handleCompleteOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Completed');
      fetchOrders();
    } catch (err) {
      setError('Error marking order as completed.');
    }
  };

  return (
    <div>
      <h2>Your Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders && orders.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order) => (
            <li key={order._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Total Cost:</strong> ${order.totalCost.toFixed(2)}</p>
              <h4>Products:</h4>
              <ul>
                {order.products.map((item, idx) => (
                  <li key={idx}>
                    {item.product.name} - Quantity: {item.quantity} - Price: ${item.product.price.toFixed(2)} - Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              {order.orderStatus === 'Processing' && (
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => handleCancelOrder(order._id)} style={{ marginRight: '0.5rem' }}>
                    Cancel Order
                  </button>
                  <button onClick={() => handleCompleteOrder(order._id)}>
                    Mark as Completed
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
