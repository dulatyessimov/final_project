// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuth');
const ActivityLog = require('../models/AcitvityLog');

// Endpoint for most viewed products
router.get('/most-viewed', adminAuthMiddleware, async (req, res) => {
  try {
    const mostViewed = await ActivityLog.aggregate([
      { $match: { eventType: 'view' } },
      { $group: { _id: "$details.productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(mostViewed);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Additional analytics endpoints can be defined here

module.exports = router;
