// src/TopicDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopicDetail = ({ match }) => {
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const { id } = match.params;
    axios.get(`/api/topics/${id}`)
      .then(response => {
        setTopic(response.data);
      })
      .catch(error => {
        console.error('Error fetching topic:', error);
      });
  }, [match.params]);

  if (!topic) return <div>Loading...</div>;

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>Votes: {topic.votes}</p>
      <h3>Comments:</h3>
      <ul>
        {topic.comments.map((comment, index) => (
          <li key={index}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDetail;
