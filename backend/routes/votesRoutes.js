// routes/votes.js
const express = require('express');
const router = express.Router();
const { getVotesByProduct, upvoteProduct, downvoteProduct } = require('../controllers/votesController');
const protectRoute = require('../middleware/protectRoute');

// Get vote count for a product
router.get('/product/:productId', getVotesByProduct);

// Upvote a product (protected)
router.post('/product/:productId/upvote', protectRoute, upvoteProduct);

// Downvote (remove vote) from a product (protected)
router.delete('/product/:productId/downvote', protectRoute, downvoteProduct);

module.exports = router;
