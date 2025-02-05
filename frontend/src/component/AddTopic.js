import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTopic } from '../api/getTopics';  // Import the addTopic function
import './AddTopic.css';

const AddTopic = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call the addTopic API function
    try {
      const response = await addTopic(title);
      console.log('Topic added:', response);
      // After successful submission, redirect to the topics page
      navigate('/topics');
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  return (
    <div className="add-topic-container">
      <h2>Add New Topic</h2>
      <form onSubmit={handleSubmit} className="add-topic-form">
        <label htmlFor="title" className="input-label">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">Add Topic</button>
      </form>
    </div>
  );
};

export default AddTopic;
