// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/getProducts';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update state for search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Update state for category filter
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Update state for price range filter
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  // Update state for availability filter
  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  // Filter products based on search and filter criteria
  const filterProducts = () => {
    return products.filter((product) => {
      // Full-text search on product name
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by category (if one is selected)
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;

      // Filter by price range (assuming product.price is a number)
      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      // Filter by availability (if set; adjust logic if availability is a boolean)
      const matchesAvailability = availability ? product.availability === availability : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
  };

  const filteredProducts = filterProducts();

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  // Build category options dynamically from products data
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div>
      <h1>Products</h1>
      <div style={{ marginBottom: '1rem' }}>
        {/* Search input */}
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchQuery} 
          onChange={handleSearchChange}
          style={{ marginRight: '1rem' }}
        />

        {/* Category filter */}
        <select value={selectedCategory} onChange={handleCategoryChange} style={{ marginRight: '1rem' }}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Price range filters */}
        <input 
          type="number" 
          name="min" 
          placeholder="Min Price" 
          value={priceRange.min} 
          onChange={handlePriceChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input 
          type="number" 
          name="max" 
          placeholder="Max Price" 
          value={priceRange.max} 
          onChange={handlePriceChange}
          style={{ marginRight: '1rem' }}
        />

        {/* Availability filter */}
        <select value={availability} onChange={handleAvailabilityChange}>
          <option value="">All</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      <ul>
        {filteredProducts.map((product) => (
          <li key={product._id}>
            <Link to={`/product/${product._id}`}>
              {product.name} - ${product.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
