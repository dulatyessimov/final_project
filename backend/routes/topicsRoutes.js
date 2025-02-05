const express = require('express');
const router = express.Router();
const { getAllTopics, addTopic, getTopicById, updateTopic, deleteTopic } = require('../controllers/topicController');
const protectRoute = require('../middleware/protectRoute');  // Assuming you have a mi

// Get all topics
router.get('/', getAllTopics);

// Add a new topic
router.post('/', addTopic);

// Get a topic by ID
router.get('/:id', getTopicById);

// Update a topic by ID
router.put('/:id', updateTopic);

// Delete a topic by ID
router.delete('/:id', deleteTopic);

module.exports = router;




// const express = require("express");
// const mongoose = require("mongoose");
// const router = express.Router();

// // Mongoose schema and model
// const topicSchema = new mongoose.Schema({
//   title: String,
//   votes: { type: Number, default: 0 },
//   comments: [{ text: String, votes: { type: Number, default: 0 } }],
// });

// const Topic = mongoose.model("Topic", topicSchema);

// // Get all topics
// router.get("/", async (req, res) => {
//   try {
//     const topics = await Topic.find();
//     res.json(topics);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching topics" });
//   }
// });

// // Get topic by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const topic = await Topic.findById(req.params.id);
//     if (!topic) return res.status(404).json({ error: "Topic not found" });
//     res.json(topic);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching the topic" });
//   }
// });

// // Add a new topic
// router.post("/", async (req, res) => {
//   try {
//     const newTopic = new Topic({ title: req.body.title });
//     await newTopic.save();
//     res.status(201).json(newTopic);
//   } catch (error) {
//     res.status(500).json({ error: "Error adding the topic" });
//   }
// });
// // Add a comment to a topic
// router.post("/:id/comments", async (req, res) => {
//   try {
//     const topic = await Topic.findById(req.params.id);
//     if (!topic) return res.status(404).json({ error: "Topic not found" });

//     const newComment = { text: req.body.text };
//     topic.comments.push(newComment);
//     await topic.save();

//     res.status(201).json(newComment);
//   } catch (error) {
//     res.status(500).json({ error: "Error adding the comment" });
//   }
// });

// // Update a topic's title or votes
// router.put("/:id", async (req, res) => {
//   try {
//     const topic = await Topic.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!topic) return res.status(404).json({ error: "Topic not found" });
//     res.json(topic);
//   } catch (error) {
//     res.status(500).json({ error: "Error updating the topic" });
//   }
// });

// // Delete a topic
// router.delete("/:id", async (req, res) => {
//   try {
//     const topic = await Topic.findByIdAndDelete(req.params.id);
//     if (!topic) return res.status(404).json({ error: "Topic not found" });
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting the topic" });
//   }
// });

// module.exports = router;
