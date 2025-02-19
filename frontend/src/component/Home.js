// src/component/Home.js
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
    <div>
      {loading && <p>Loading topics...</p>}
      {error && <p>{error}</p>}
      <ul>
        {topics.map((topic) => (
          <li key={topic._id}>
            <Link to={`/topics/${topic._id}`}>{topic.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
