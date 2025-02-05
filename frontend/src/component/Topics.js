import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import './Topics.css';
import { getTopics, editTopic, deleteTopic } from '../api/getTopics'; // Assuming api.js is the file where the functions are

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await getTopics(); // Use the getTopics API function
        setTopics(topicsData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching topics');
        setLoading(false);
        console.error('Error fetching topics:', err);
      }
    };

    fetchTopics();
  }, []);

  const handleDelete = async (topicId) => {


      try {
        await deleteTopic(topicId); // Use the deleteTopic API function
        setTopics(topics.filter(topic => topic._id !== topicId));
      } catch (error) {
        setError('Error deleting topic');
        console.error('Error deleting topic:', error);
      }

  };

  const handleEdit = async (topicId, newTitle) => {


      try {
        await editTopic(topicId, newTitle); // Use the editTopic API function
        const updatedTopics = topics.map(topic =>
          topic._id === topicId ? { ...topic, title: newTitle } : topic
        );
        setTopics(updatedTopics);
      } catch (error) {
        setError('Error editing topic');
        console.error('Error editing topic:', error);
      }
    
  };

  return (
    <div className="topics-container">
      <h1>Topics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul className="topics-list">
        {topics.map(topic => (
          <li key={topic._id} className="topic-item">
            <Link to={`/topics/${topic._id}`} className="topic-link">{topic.title}</Link>
            <button onClick={() => handleEdit(topic._id, prompt('Edit title:', topic.title))}>
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
