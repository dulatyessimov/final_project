import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCart, checkoutCart, deleteCartItem } from '../api/cart';

const ShoppingCart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the shopping cart (pending order)
  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError('Error fetching cart.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Example handler to update cart (if you wish to allow modifications)
  const handleUpdateCart = async () => {
    try {
      // For demonstration, we simulate updating the cart with one product entry.
      const updatedProducts = [
        { product: "PRODUCT_ID_123", quantity: 2 }
      ];
      const updatedTotalCost = 49.99;
      const data = await updateCart(updatedProducts, updatedTotalCost);
      setCart(data);
    } catch (err) {
      setError('Error updating cart.');
    }
  };

  // Checkout: update the order status from Pending to Processing after (simulated) payment
  const handleCheckout = async () => {
    try {
      const data = await checkoutCart();
      alert(data.message);
      navigate('/order-success'); // Redirect to a success page after checkout
    } catch (err) {
      setError('Checkout failed.');
    }
  };

  // Delete a specific item from the cart
  const handleDeleteItem = async (productId) => {
    try {
      await deleteCartItem(productId);
      // Refresh the cart after deletion
      fetchCart();
    } catch (err) {
      setError('Error deleting item from cart.');
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cart ? (
        <div>
          <ul>
            {cart.products.map((item, index) => (
              <li key={index}>
                {item.product.name} - Quantity: {item.quantity}{" "}
                <button onClick={() => handleDeleteItem(item.product._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p>Total Cost: ${cart.totalCost}</p>
          <button onClick={handleUpdateCart}>Update Cart (Demo)</button>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      ) : (
        <p>Loading cart...</p>
      )}
    </div>
  );
};

export default ShoppingCart;
