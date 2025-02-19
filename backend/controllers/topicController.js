const Topic = require('../models/Topic');

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate("userId", "username"); // Optional: Show author username
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate("userId", "username");
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new topic
exports.addTopic = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?._id; // Extract user ID from authentication middleware

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const newTopic = new Topic({ title, content, userId });
    const savedTopic = await newTopic.save();
    res.json(savedTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a topic by ID
exports.updateTopic = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?._id; // Get user ID from authentication middleware

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    if (topic.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized: You can only edit your own topics" });
    }

    topic.title = title;
    topic.content = content;
    const updatedTopic = await topic.save();
    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a topic by ID
exports.deleteTopic = async (req, res) => {
  try {
    const userId = req.user?._id; // Get user ID from authentication middleware

    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    if (topic.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own topics" });
    }

    await topic.deleteOne();
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
