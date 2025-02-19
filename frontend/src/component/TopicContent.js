// src/component/TopicContent.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Import API helper functions
import { getTopicById } from '../api/getTopics';
import {
  getCommentsByTopic,
  addComment,
  editComment,
  deleteComment,
} from '../api/comments';
import { getVotesByTopic, upvoteTopic, downvoteTopic } from '../api/votes';
import { getCurrentUser } from '../api/auth';

const TopicContent = () => {
  const { id } = useParams();

  const [topic, setTopic] = useState(null);
  const [votesCount, setVotesCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Fetch topic details
  useEffect(() => {
    getTopicById(id)
      .then((data) => setTopic(data))
      .catch((error) => console.error('Error fetching topic:', error));
  }, [id]);

  // Fetch votes count for the topic
  useEffect(() => {
    getVotesByTopic(id)
      .then((data) => setVotesCount(data.votes))
      .catch((error) => console.error('Error fetching votes:', error));
  }, [id]);

  // OPTIONAL: Fetch whether the current user has already voted.
  // You might implement a similar API helper function (e.g., getUserVoteStatus) if needed.
  // For now, we'll assume that if the user has voted, the backend would have returned that info in the topic data.
  // Alternatively, you can store vote status locally when the user upvotes/downvotes.

  // Fetch comments for this topic
  useEffect(() => {
    getCommentsByTopic(id)
      .then((data) => setComments(data))
      .catch((error) => console.error('Error fetching comments:', error));
  }, [id]);

  // Fetch current user info
  useEffect(() => {
    getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch((error) => console.error('Error fetching current user:', error));
  }, []);

  // Toggle vote: upvote if not voted yet; cancel vote if already voted
  const handleVoteToggle = () => {
    if (hasVoted) {
      downvoteTopic(id)
        .then((data) => {
          setVotesCount(data.votes);
          setHasVoted(false);
        })
        .catch((error) => console.error('Error canceling vote:', error));
    } else {
      upvoteTopic(id)
        .then((data) => {
          setVotesCount(data.votes);
          setHasVoted(true);
        })
        .catch((error) => console.error('Error upvoting topic:', error));
    }
  };

  // Add a new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    addComment(id, newCommentText)
      .then((data) => {
        setComments([...comments, data]);
        setNewCommentText('');
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    deleteComment(commentId)
      .then(() => {
        setComments(comments.filter((comment) => comment._id !== commentId));
      })
      .catch((error) => console.error('Error deleting comment:', error));
  };

  // Begin editing a comment
  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
  };

  // Submit edited comment
  const handleEditComment = (e) => {
    e.preventDefault();
    editComment(editingCommentId, editingCommentText)
      .then((data) => {
        setComments(
          comments.map((comment) =>
            comment._id === editingCommentId ? data : comment
          )
        );
        setEditingCommentId(null);
        setEditingCommentText('');
      })
      .catch((error) => console.error('Error editing comment:', error));
  };

  if (!topic) return <div>Loading...</div>;

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.content}</p>
      <p>Votes: {votesCount}</p>
      <button onClick={handleVoteToggle}>
        {hasVoted ? 'Cancel Vote' : 'Upvote'}
      </button>

      <h3>Comments:</h3>
      <ul>
        {comments.map((comment) => {
          // Determine the comment’s user ID (handle both populated and unpopulated cases)
          const commentUserId =
            comment.userId && (comment.userId._id || comment.userId);
          const currentUserId = currentUser && currentUser._id;

          return (
            <li key={comment._id}>
              {editingCommentId === comment._id ? (
                <form onSubmit={handleEditComment}>
                  <input
                    type="text"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                  />
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentText('');
                    }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  {comment.text}
                  {currentUser &&
                    commentUserId === currentUserId && (
                      <>
                        <button onClick={() => startEditingComment(comment)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteComment(comment._id)}>
                          Delete
                        </button>
                      </>
                    )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TopicContent;
