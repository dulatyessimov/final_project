// routes/comments.js
const express = require('express');
const router = express.Router();
const { getCommentsByTopic, addComment, editComment, deleteComment } = require('../controllers/commentController');
const protectRoute = require('../middleware/protectRoute');

// Get all comments for a topic
router.get('/topic/:topicId', getCommentsByTopic);

// Add a new comment to a topic (protected)
router.post('/topic/:topicId/add', protectRoute, addComment);

// Edit a comment (protected)
router.put('/edit/:commentId', protectRoute, editComment);

// Delete a comment (protected)
router.delete('/delete/:commentId', protectRoute, deleteComment);

module.exports = router;
