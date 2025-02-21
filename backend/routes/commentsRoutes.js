// routes/comments.js
const express = require('express');
const router = express.Router();
const { getCommentsByProduct, addComment, editComment, deleteComment } = require('../controllers/commentController');
const protectRoute = require('../middleware/protectRoute');

// Get all comments for a Product
router.get('/product/:productId', getCommentsByProduct);

// Add a new comment to a Product (protected)
router.post('/product/:productId/add', protectRoute, addComment);

// Edit a comment (protected)
router.put('/edit/:commentId', protectRoute, editComment);

// Delete a comment (protected)
router.delete('/delete/:commentId', protectRoute, deleteComment);

module.exports = router;
