// src/components/AnalyticsDashboard.js
import React, { useEffect, useState } from 'react';
import { getMostViewed } from '../api/log';

const AnalyticsDashboard = () => {
  const [mostViewed, setMostViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getMostViewed();
        setMostViewed(data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Admin Analytics Dashboard</h1>
      <h2>Most Viewed Products</h2>
      <ul>
        {mostViewed.map(item => (
          <li key={item._id}>
            Product ID: {item._id} - Views: {item.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalyticsDashboard;
