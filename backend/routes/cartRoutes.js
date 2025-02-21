const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCart,
  checkoutCart,
  deleteCartItem
} = require('../controllers/cartController');
const protectRoute = require('../middleware/protectRoute');

// Shopping Cart endpoints
router.get('/', protectRoute, getCart);                 // GET /api/cart
router.post('/add', protectRoute, addToCart);             // POST /api/cart/add
router.put('/', protectRoute, updateCart);                // PUT /api/cart
router.delete('/item/:productId', protectRoute, deleteCartItem); // DELETE /api/cart/item/:productId
router.post('/checkout', protectRoute, checkoutCart);     // POST /api/cart/checkout

module.exports = router;
