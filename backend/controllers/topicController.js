const Topic = require('../models/Topic.js'); // Assuming you have a Topic model

// Get all topics
exports.getAllTopics = (req, res) => {
  Topic.find()
    .then((topics) => res.json(topics))
    .catch((error) => res.status(500).json({ error: 'Error fetching topics' }));
};

// Add a new topic
exports.addTopic = (req, res) => {
  const newTopic = new Topic({ title: req.body.title });

  newTopic
    .save()
    .then((topic) => res.json(topic))
    .catch((error) => res.status(500).json({ error: 'Error adding topic' }));
};

// Get a topic by ID
exports.getTopicById = (req, res) => {
  Topic.findById(req.params.id)
    .then((topic) => {
      if (!topic) return res.status(404).json({ error: 'Topic not found' });
      res.json(topic);
    })
    .catch((error) => res.status(500).json({ error: 'Error fetching topic' }));
};

// Update a topic by ID
exports.updateTopic = (req, res) => {
  const { title } = req.body; // Assuming you are only updating the title for simplicity
  Topic.findByIdAndUpdate(req.params.id, { title }, { new: true })
    .then((updatedTopic) => {
      if (!updatedTopic) return res.status(404).json({ error: 'Topic not found' });
      res.json(updatedTopic);
    })
    .catch((error) => res.status(500).json({ error: 'Error updating topic' }));
};

// Delete a topic by ID
exports.deleteTopic = (req, res) => {
  Topic.findByIdAndDelete(req.params.id)
    .then((deletedTopic) => {
      if (!deletedTopic) return res.status(404).json({ error: 'Topic not found' });
      res.json({ message: 'Topic deleted successfully' });
    })
    .catch((error) => res.status(500).json({ error: 'Error deleting topic' }));
};
