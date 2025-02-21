const express = require('express');
const router = express.Router();
const {
  getUserOrders,
  updateOrder,  // used for updating order status
  // ... other controllers
} = require('../controllers/orderController');
const protectRoute = require('../middleware/protectRoute');

// Orders endpoints
router.get('/user-orders', protectRoute, getUserOrders);
router.put('/edit/:id', protectRoute, updateOrder);

// ... other routes

module.exports = router;
