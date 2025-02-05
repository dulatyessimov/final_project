import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import Home from './component/Home';
import Topics from './component/Topics';
import TopicDetail from './component/TopicDetail';
import AddTopic from './component/AddTopic';
import Auth from './component/Auth';
import { logout } from './api/auth'; // Import the logout function

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if token exists in cookies when the component mounts
  useEffect(() => {
    // Use the HTTP-only cookie, no need to manually check it here
    const token = Cookies.get('token'); // Get token from cookies for initial authentication check
    console.log('Token from cookies App.js:', token); // Check token in browser console
    if (token) {
      setIsAuthenticated(true); // If token exists, the user is authenticated
    }
  }, []);

  // Handle the logout by removing the token from cookies and calling the API
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from the API
      Cookies.remove('token'); // Remove token from cookies
      setIsAuthenticated(false); // Update the auth state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    <BrowserRouter>
      <div>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/home">Home</Link>
              <Link to="/topics">Topics</Link>
              <Link to="/add-topic">Add Topic</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <h3>Please log in to access the app</h3>
          )}
        </nav>

        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/home" /> : <Auth isLogin={true} onAuthSuccess={() => { setIsAuthenticated(true); console.log("User logged in successfully"); }} />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/home" /> : <Auth isLogin={false} onAuthSuccess={() => setIsAuthenticated(true)} />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/topics"
            element={isAuthenticated ? <Topics /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/topics/:id"
            element={isAuthenticated ? <TopicDetail /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/add-topic"
            element={isAuthenticated ? <AddTopic /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
