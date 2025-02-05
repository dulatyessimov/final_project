import React, { useState, useEffect } from 'react';
import { getTopics } from '../api/getTopics';  // Import the getTopics function

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();  // Use the getTopics function
        setTopics(data);  // Set the topics data from the response
        setLoading(false);  // Stop loading
      } catch (error) {
        setError('Error fetching topics');  // Error if the request fails
        setLoading(false);  // Stop loading
      }
    };

    fetchTopics();  // Call fetchTopics to fetch the data when the component mounts
  }, []);  // Empty dependency array so it only runs once on mount

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>{topic.title}</li>  // Render each topic
        ))}
      </ul>
    </div>
  );
};

export default Home;
