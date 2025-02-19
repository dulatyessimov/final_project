import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTopic } from '../api/getTopics';  // Import API function
import './AddTopic.css';

const AddTopic = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!title.trim() || !content.trim()) {
      setError('Title and Content cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null); // Reset error before making request

    try {
      await addTopic( title, content );
      navigate('/topics'); // Redirect to topics list
    } catch (err) {
      setError(err.message || 'Error adding topic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-topic-container">
      <h2>Add New Topic</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-topic-form">
        <label htmlFor="title" className="input-label">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input-field"
        />

        <label htmlFor="content" className="input-label">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="textarea-field"
        />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Topic'}
        </button>
      </form>
    </div>
  );
};

export default AddTopic;
