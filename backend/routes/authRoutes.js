const express = require('express');
const { registerUser, loginUser, logoutUser, getCurrentUser } = require('../controllers/userController');
const { addTopic } = require('../controllers/topicController');
const protectRoute = require('../middleware/protectRoute'); // Middleware for protected routes

const router = express.Router();

// Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/me', protectRoute, getCurrentUser); // Protected route to get user info

module.exports = router;
