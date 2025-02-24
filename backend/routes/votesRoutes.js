// routes/votes.js
const express = require('express');
const router = express.Router();
const { getVotesByTopic, upvoteTopic, downvoteTopic } = require('../controllers/votesController');
const protectRoute = require('../middleware/protectRoute');

// Get vote count for a topic
router.get('/topic/:topicId', getVotesByTopic);

// Upvote a topic (protected)
router.post('/topic/:topicId/upvote', protectRoute, upvoteTopic);

// Downvote (remove vote) from a topic (protected)
router.delete('/topic/:topicId/downvote', protectRoute, downvoteTopic);

module.exports = router;
