const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const User = require('../models/User');

const protectRoute = async (req, res, next) => {
  // Retrieve token from cookies
  const token = req.cookies.token;
  
  // If no token is provided, return error
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);  // Debugging decoded token

    // Find the user by the decoded userId
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found. Authentication failed' });
    }

    // Check if the session is active in MongoDB
    const session = await Session.findOne({ userId: decoded.userId, token, isActive: true });
    console.log('Session:', session);  // Debugging session status
    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    // Attach the user object to the request for further use in route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle any errors (invalid token, expired session, etc.)
    console.log('Error verifying token or session:', error);  // Debugging
    res.status(401).json({ error: 'Invalid or expired token. Authentication failed' });
  }
};

module.exports = protectRoute;
