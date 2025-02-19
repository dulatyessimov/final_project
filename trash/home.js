import React, { useEffect, useState } from "react";
import axios from "axios"; // If using axios for fetching data

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend when the component mounts
  useEffect(() => {
    // Use Axios to get data
    axios
      .get("http://localhost:5000/topics") // Change URL if needed
      .then((response) => {
        setTopics(response.data); // Set the data to state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Discussion Forum</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <h2>{topic.title}</h2>
            <p>Votes: {topic.votes}</p>
            {/* Display comments if necessary */}
            <ul>
              {topic.comments.map((comment, index) => (
                <li key={index}>{comment.text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
