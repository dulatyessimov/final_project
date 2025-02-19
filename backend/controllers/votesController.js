// controllers/votesController.js
const Vote = require('../models/Vote');

// Get vote count for a topic
exports.getVotesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const votes = await Vote.countDocuments({ topicId });
    res.json({ votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upvote a topic
exports.upvoteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user._id;

    // Check if the user already voted for this topic
    const existingVote = await Vote.findOne({ topicId, userId });
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted for this topic" });
    }

    const vote = new Vote({
      topicId,
      userId,
    });

    await vote.save();
    // Return updated vote count
    const votesCount = await Vote.countDocuments({ topicId });
    res.json({ votes: votesCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Downvote (remove vote) from a topic
exports.downvoteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user._id;

    const vote = await Vote.findOne({ topicId, userId });
    if (!vote) {
      return res.status(400).json({ error: "You have not voted for this topic" });
    }

    await vote.deleteOne();
    const votesCount = await Vote.countDocuments({ topicId });
    res.json({ votes: votesCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
