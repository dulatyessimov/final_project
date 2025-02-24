const express = require('express');
const router = express.Router();
const { getAllTopics, addTopic, getTopicById, updateTopic, deleteTopic } = require('../controllers/topicController');
const protectRoute = require('../middleware/protectRoute');  // Assuming you have a mi

// Get all topics
router.get('/', getAllTopics);



// Get a topic by ID
router.get('/:id', getTopicById);

// Update a topic by ID
router.put('/edit/:id', updateTopic);

// Delete a topic by ID
router.delete('/delete/:id', deleteTopic);

router.post('/add', protectRoute, addTopic); // Protect the route

module.exports = router;



