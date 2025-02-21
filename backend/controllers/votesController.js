// controllers/votesController.js
const Vote = require('../models/Vote');

// Get vote count for a product
exports.getVotesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const votes = await Vote.countDocuments({ productId });
    res.json({ votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upvote a product
exports.upvoteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if the user already voted for this product
    const existingVote = await Vote.findOne({ productId, userId });
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted for this product" });
    }

    const vote = new Vote({
      productId,
      userId,
    });

    await vote.save();
    // Return updated vote count
    const votesCount = await Vote.countDocuments({ productId });
    res.json({ votes: votesCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Downvote (remove vote) from a product
exports.downvoteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const vote = await Vote.findOne({ productId, userId });
    if (!vote) {
      return res.status(400).json({ error: "You have not voted for this product" });
    }

    await vote.deleteOne();
    const votesCount = await Vote.countDocuments({ productId });
    res.json({ votes: votesCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
