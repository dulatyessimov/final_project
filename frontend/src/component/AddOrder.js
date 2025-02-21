import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOrder } from '../api/getOrders';
//import './AddOrder.css';

const AddOrder = () => {
  const [products, setProducts] = useState([]);
  const [totalCost, setTotalCost] = useState('');
  const [orderStatus, setOrderStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Here we assume that products are provided as a JSON string for simplicity.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse products input if necessary
      const orderData = {
        products,
        totalCost: parseFloat(totalCost),
        orderStatus
      };
      await addOrder(orderData);
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Error adding order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-order-container">
      <h2>Add New Order</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-order-form">
        <label>Total Cost:</label>
        <input
          type="number"
          value={totalCost}
          onChange={e => setTotalCost(e.target.value)}
          required
        />

        <label>Order Status:</label>
        <select
          value={orderStatus}
          onChange={e => setOrderStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <label>Products (JSON format):</label>
        <textarea
          value={JSON.stringify(products)}
          onChange={e => {
            try {
              setProducts(JSON.parse(e.target.value));
            } catch (err) {
              // Handle invalid JSON if needed
            }
          }}
          placeholder='[{"product": "productId", "quantity": 2}]'
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Order'}
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
