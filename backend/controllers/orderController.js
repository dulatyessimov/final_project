// controllers/orderController.js
const Order = require('../models/Order');

// Fetch orders for the current user with status "Processing" or "Completed"
exports.getUserOrders = async (req, res) => {
  try {
    const user = req.user?._id;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }
    const orders = await Order.find({
      user,
      orderStatus: { $in: ['Processing', 'Completed'] }
    })
      .populate('products.product', 'name price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an order's status (assuming this function is defined correctly)
exports.updateOrder = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ error: 'Order not found' });

    // Update the status to the new value (e.g., 'Cancelled' or 'Completed')
    order.orderStatus = orderStatus || order.orderStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
