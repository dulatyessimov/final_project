// controllers/logController.js
const ActivityLog = require('../models/ActivityLog');

// Middleware function to log product views
exports.logProductView = async (req, res, next) => {
  try {
    await ActivityLog.create({
      userId: req.user._id,
      eventType: 'view',
      details: { productId: req.params.productId }
    });
    next();
  } catch (err) {
    console.error('Logging error', err);
    next(); // Proceed even if logging fails
  }
};
