import React, { useState, useEffect } from 'react';
import { getTopics } from '../api/getTopics';
import { Link } from 'react-router-dom';

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (err) {
        setError('Error fetching topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="topics-container">
      {loading && <p>Loading topics...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul className="topics-list">
        {topics.map((topic) => (
          <li key={topic._id}>
            <Link to={`/topics/${topic._id}`} className="topic-link">
              {topic.title} <span className="creator">by {topic.userId?.username || 'Unknown'}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
