// middleware/adminAuth.js
module.exports = (req, res, next) => {
    // Example: Check if the request has a header 'x-admin' set to 'true'
    // Replace this with your real authentication logic (e.g., checking req.user.role)
    if (req.headers['x-admin'] === 'true') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied: Admins only' });
    }
  };
  