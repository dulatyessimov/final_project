// controllers/commentsController.js
const Comment = require('../models/Comment');
const Topic = require('../models/Topic');

// Get all comments for a specific topic
exports.getCommentsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const comments = await Comment.find({ topicId }).populate("userId", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new comment to a topic
exports.addComment = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { commentText } = req.body;
    const userId = req.user._id; // Assumes authentication middleware sets req.user

    // Optionally, verify the topic exists
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const newComment = new Comment({
      topicId,
      userId,
      text: commentText,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a comment
exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized: Cannot edit this comment" });
    }

    comment.text = commentText;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized: Cannot delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
