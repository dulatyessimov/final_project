// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import Products from './component/Products';
import Home from './component/Home';                  // Home lists products (name and price)
import AddProduct from './component/AddProduct';       // Form to add a new product
import ProductContent from './component/ProductContent';// Detailed product view with comments, votes, & "Buy Now"
import ShoppingCart from './component/ShoppingCart';   // Shopping cart page
import OrdersPage from './component/OrdersPage';       // Orders page for Processing/Completed orders
import Auth from './component/Auth';                   // Login/Signup component
import VerifyEmail from './component/VerifyEmail';     // Email verification screen
import AnalyticsDashboard from './component/AnalyticsDashboard'; // Admin analytics dashboard
import { logout, getCurrentUser } from './api/auth';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Prevent flickering on page load

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
        setIsEmailVerified(user?.emailVerified || true);
        // Assume the user object has a 'role' property.
        setIsAdmin(user?.role === 'admin');
        console.log("Auth State:", { isAuthenticated, isEmailVerified, isAdmin: user?.role === 'admin' });
      } catch (error) {
        setIsAuthenticated(false);
        setIsEmailVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const handleAuthSuccess = async () => {
    const user = await getCurrentUser();
    setIsAuthenticated(true);
    setIsEmailVerified(user.emailVerified);
    setIsAdmin(user?.role === 'admin');
  };

  if (loading) return <p>Loading...</p>; // Prevent unnecessary redirects while checking auth state

  return (
    <BrowserRouter>
      <nav>
        {isAuthenticated ? (
          <>
            {isEmailVerified ? (
              <>
                <Link to="/home">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/add-product">Add Products</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
                {/* Show the Admin Dashboard link only if the user is an admin */}
                {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
              </>
            ) : (
              <Link to="/verify-email">Verify Email</Link>
            )}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Navigate to="/login" replace />
        )}
      </nav>

      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated 
              ? <Auth isLogin={true} onAuthSuccess={handleAuthSuccess} /> 
              : <Navigate to={isEmailVerified ? "/home" : "/verify-email"} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            !isAuthenticated 
              ? <Auth isLogin={false} onAuthSuccess={handleAuthSuccess} /> 
              : <Navigate to={isEmailVerified ? "/home" : "/verify-email"} />
          } 
        />

        {/* Protected Routes (Only for Authenticated & Verified Users) */}
        <Route path="/home" element={isAuthenticated && isEmailVerified ? <Home /> : <Navigate to="/verify-email" />} />
        <Route path="/products" element={isAuthenticated && isEmailVerified ? <Home /> : <Navigate to="/verify-email" />} />
        <Route path="/product/:id" element={isAuthenticated && isEmailVerified ? <ProductContent /> : <Navigate to="/verify-email" />} />
        <Route path="/cart" element={isAuthenticated && isEmailVerified ? <ShoppingCart /> : <Navigate to="/verify-email" />} />
        <Route path="/add-product" element={isAuthenticated && isEmailVerified ? <AddProduct /> : <Navigate to="/verify-email" />} />
        <Route path="/orders" element={isAuthenticated && isEmailVerified ? <OrdersPage /> : <Navigate to="/verify-email" />} />
        <Route path="/verify-email" element={isAuthenticated && !isEmailVerified ? <VerifyEmail /> : <Navigate to="/home" />} />

        {/* Admin Analytics Dashboard Route */}
        <Route path="/admin" element={isAuthenticated && isEmailVerified && isAdmin ? <AnalyticsDashboard /> : <Navigate to="/home" />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? (isEmailVerified ? "/home" : "/verify-email") : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
