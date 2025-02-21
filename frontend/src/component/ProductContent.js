// src/components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/getProducts';
import { addToCart } from '../api/cart';
import {
  getCommentsByProduct,
  addComment,
  editComment,
  deleteComment,
} from '../api/comments';
import {
  getVotesByProduct,
  upvoteProduct,
  downvoteProduct,
} from '../api/votes';
import { getCurrentUser } from '../api/auth';

const ProductContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [votesCount, setVotesCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch product details
  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error('Error fetching product:', err);
        setError('Error fetching product details');
      });
  }, [id]);

  // Fetch votes count for the product
  useEffect(() => {
    getVotesByProduct(id)
      .then((data) => setVotesCount(data.votes))
      .catch((err) => console.error('Error fetching votes:', err));
  }, [id]);

  // Fetch comments for this product
  useEffect(() => {
    getCommentsByProduct(id)
      .then((data) => setComments(data))
      .catch((err) => console.error('Error fetching comments:', err));
  }, [id]);

  // Fetch current user info
  useEffect(() => {
    getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error('Error fetching current user:', err));
  }, []);

  // Handle vote toggle (upvote/downvote)
  const handleVoteToggle = () => {
    if (hasVoted) {
      downvoteProduct(id)
        .then((data) => {
          setVotesCount(data.votes);
          setHasVoted(false);
        })
        .catch((err) => console.error('Error canceling vote:', err));
    } else {
      upvoteProduct(id)
        .then((data) => {
          setVotesCount(data.votes);
          setHasVoted(true);
        })
        .catch((err) => console.error('Error upvoting product:', err));
    }
  };

  // Add new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    addComment(id, newCommentText)
      .then((data) => {
        setComments([...comments, data]);
        setNewCommentText('');
      })
      .catch((err) => console.error('Error adding comment:', err));
  };

  // Delete comment
  const handleDeleteComment = (commentId) => {
    deleteComment(commentId)
      .then(() => {
        setComments(comments.filter((comment) => comment._id !== commentId));
      })
      .catch((err) => console.error('Error deleting comment:', err));
  };

  // Begin editing comment
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
      .catch((err) => console.error('Error editing comment:', err));
  };

  // Buy Now: add product to cart and redirect to the shopping cart page
  const handleBuyNow = async () => {
    try {
      await addToCart(id, quantity);
      setMessage('Product added to cart!');
      navigate('/cart');
    } catch (err) {
      console.error('Error adding product to cart:', err);
      setError('Failed to add product to cart.');
    }
  };

  if (!product) return <div>Loading product details...</div>;

  return (
    <div className="product-details">
      {error && <p className="error">{error}</p>}
      <h1>{product.name}</h1>
      {product.images && product.images.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image"
        />
      )}
      <p className="price">Price: ${product.price.toFixed(2)}</p>
      <p className="description">Description: {product.description}</p>
      <p className="stock">Available: {product.stockQuantity}</p>

      <div className="purchase">
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          max={product.stockQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={handleBuyNow}>Buy Now</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="voting">
        <p>Votes: {votesCount}</p>
        <button onClick={handleVoteToggle}>
          {hasVoted ? 'Cancel Vote' : 'Upvote'}
        </button>
      </div>

      <div className="comments-section">
        <h3>Comments:</h3>
        <ul>
          {comments.map((comment) => {
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
                    {currentUser && commentUserId === currentUserId && (
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
    </div>
  );
};

export default ProductContent;
