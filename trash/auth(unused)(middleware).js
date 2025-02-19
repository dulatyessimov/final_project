const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  // If no token is provided, return a 401 error
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret'); 

    // Attach the decoded user info to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = protect;
