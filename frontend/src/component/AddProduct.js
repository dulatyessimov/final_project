import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/getProducts';
import './AddProduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState(0);
  const [images, setImages] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !price) {
      setError('Name and Price are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Assuming images are provided as comma-separated URLs
      const productData = {
        name,
        price: parseFloat(price),
        description,
        category,
        stockQuantity: parseInt(stockQuantity),
        images: images.split(',').map(url => url.trim())
      };

      await addProduct(productData);
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-product-form">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <label>Stock Quantity:</label>
        <input
          type="number"
          value={stockQuantity}
          onChange={e => setStockQuantity(e.target.value)}
          required
        />

        <label>Images (comma separated URLs):</label>
        <input
          type="text"
          value={images}
          onChange={e => setImages(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
