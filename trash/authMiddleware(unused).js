const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Adjust path as necessary

// Authentication Middleware
const authenticateUser = async (req, res, next) => {
  // Retrieve token from cookies or Authorization header (Bearer token)
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the decoded user ID
    const user = await User.findById(decoded.userId);  // Adjust field name if needed

    // If the user doesn't exist, return an authentication failure
    if (!user) {
      return res.status(401).json({ error: 'User not found. Authentication failed' });
    }

    // Attach the user object to the request for further use in route handlers
    req.user = user;
    next();  // Continue to the next middleware or route handler
  } catch (error) {
    // Handle token errors such as expiration or invalid token
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid or expired token. Authentication failed' });
  }
};

module.exports = { authenticateUser };
