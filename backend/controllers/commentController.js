// controllers/commentsController.js
const Comment = require('../models/Comment');
const Product = require('../models/Product');

// Get all comments for a specific product
exports.getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.find({ productId }).populate("userId", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new comment to a product
exports.addComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { commentText } = req.body;
    const userId = req.user._id; // Assumes authentication middleware sets req.user

    // Optionally, verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    const newComment = new Comment({
      productId,
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
