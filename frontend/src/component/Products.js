// src/component/products.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import './products.css';
import { getProducts, deleteProduct } from '../api/getProducts';
import { getCurrentUser } from '../api/auth';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, get the current user
        const user = await getCurrentUser();
        setCurrentUser(user);

        // Then, fetch all products
        const productsData = await getProducts();

        // Filter products to only include those that belong to the current user.
        const userProducts = productsData.filter((product) => {
          // Check if product.userId is an object (populated) or a string
          if (typeof product.userId === 'object' && product.userId !== null) {
            return product.userId._id === user._id;
          }
          return product.userId === user._id;
        });

        setProducts(userProducts);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      setError('Error deleting product');
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="products-container">
      <h1>My products</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul className="products-list">
        {products.map((product) => (
          <li key={product._id} className="product-item">
            <Link to={`/products/${product._id}`} className="product-link">
              {product.title}
            </Link>
            <button onClick={() => navigate(`/edit-product/${product._id}`)}>
              Edit
            </button>
            <button onClick={() => handleDelete(product._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
