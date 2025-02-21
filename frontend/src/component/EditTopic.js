// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTopicById, editTopic } from '../api/getTopics';
// //import './AddTopic.css'; // Reuse the styles from AddTopic

// const EditTopic = () => {
//   const { id } = useParams(); // Get topic ID from the URL
//   const navigate = useNavigate();
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch the existing topic data when the component mounts
//   useEffect(() => {
//     const fetchTopic = async () => {
//       try {
//         const topicData = await getTopicById(id);
//         setTitle(topicData.title);
//         setContent(topicData.content);
//       } catch (err) {
//         setError('Error fetching topic.');
//         console.error('Error fetching topic:', err);
//       }
//     };
//     fetchTopic();
//   }, [id]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!title.trim() || !content.trim()) {
//       setError('Title and Content cannot be empty.');
//       return;
//     }
//     setLoading(true);
//     try {
//       // The editTopic API function expects id, title, and content
//       await editTopic(id, title, content);
//       navigate('/topics'); // Redirect back to topics list on success
//     } catch (err) {
//       setError(err.message || 'Error updating topic.');
//       console.error('Error updating topic:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-topic-container">
//       <h2>Edit Topic</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleSubmit} className="add-topic-form">
//         <label htmlFor="title" className="input-label">Title:</label>
//         <input
//           type="text"
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="input-field"
//         />

//         <label htmlFor="content" className="input-label">Content:</label>
//         <textarea
//           id="content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           required
//           className="textarea-field"
//         />

//         <button type="submit" className="submit-button" disabled={loading}>
//           {loading ? 'Updating...' : 'Update Topic'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditTopic;
