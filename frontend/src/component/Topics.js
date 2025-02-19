// src/component/Topics.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Topics.css';
import { getTopics, deleteTopic } from '../api/getTopics';
import { getCurrentUser } from '../api/auth';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, get the current user
        const user = await getCurrentUser();
        setCurrentUser(user);

        // Then, fetch all topics
        const topicsData = await getTopics();

        // Filter topics to only include those that belong to the current user.
        const userTopics = topicsData.filter((topic) => {
          // Check if topic.userId is an object (populated) or a string
          if (typeof topic.userId === 'object' && topic.userId !== null) {
            return topic.userId._id === user._id;
          }
          return topic.userId === user._id;
        });

        setTopics(userTopics);
        setLoading(false);
      } catch (err) {
        setError('Error fetching topics');
        setLoading(false);
        console.error('Error fetching topics:', err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (topicId) => {
    try {
      await deleteTopic(topicId);
      setTopics(topics.filter((topic) => topic._id !== topicId));
    } catch (err) {
      setError('Error deleting topic');
      console.error('Error deleting topic:', err);
    }
  };

  return (
    <div className="topics-container">
      <h1>My Topics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul className="topics-list">
        {topics.map((topic) => (
          <li key={topic._id} className="topic-item">
            <Link to={`/topics/${topic._id}`} className="topic-link">
              {topic.title}
            </Link>
            <button onClick={() => navigate(`/edit-topic/${topic._id}`)}>
              Edit
            </button>
            <button onClick={() => handleDelete(topic._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;
