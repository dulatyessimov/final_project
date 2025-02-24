const mongoose = require('mongoose');

// Define the schema for a topic
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensures that every topic has a title
  },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created it
  votes: {
    type: Number,
    default: 0, // Default value of 0 for votes
  },
  comments: {
    type: [String],
    default: [], // Default is an empty array for comments
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Topic model from the schema
const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic; // Export the Topic model to be used in other files
