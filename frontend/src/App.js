import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import Home from './component/Home';
import Topics from './component/Topics';
import TopicContent from './component/TopicContent';
import AddTopic from './component/AddTopic';
import EditTopic from './component/EditTopic';
import Auth from './component/Auth';
import VerifyEmail from './component/VerifyEmail';
import { logout, getCurrentUser } from './api/auth';
import './App.css'; // Import the new global styles

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
        setIsEmailVerified(user?.emailVerified || false);
        console.log("Auth State:", { isAuthenticated, isEmailVerified });
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
  };

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <nav>
        {isAuthenticated ? (
          <>
            {isEmailVerified ? (
              <>
                <Link to="/home">Home</Link>
                <Link to="/topics">Topics</Link>
                <Link to="/add-topic">Add Topic</Link>
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

      <div className="container">
        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Auth isLogin={true} onAuthSuccess={handleAuthSuccess} /> : <Navigate to={isEmailVerified ? "/home" : "/verify-email"} />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <Auth isLogin={false} onAuthSuccess={handleAuthSuccess} /> : <Navigate to={isEmailVerified ? "/home" : "/verify-email"} />} 
          />

          {/* Protected Routes */}
          <Route path="/home" element={isAuthenticated && isEmailVerified ? <Home /> : <Navigate to="/verify-email" />} />
          <Route path="/topics" element={isAuthenticated && isEmailVerified ? <Topics /> : <Navigate to="/verify-email" />} />
          <Route path="/topics/:id" element={isAuthenticated && isEmailVerified ? <TopicContent /> : <Navigate to="/verify-email" />} />
          <Route path="/add-topic" element={isAuthenticated && isEmailVerified ? <AddTopic /> : <Navigate to="/verify-email" />} />
          <Route path="/edit-topic/:id" element={isAuthenticated && isEmailVerified ? <EditTopic /> : <Navigate to="/verify-email" />} />

          {/* Email Verification Route */}
          <Route path="/verify-email" element={isAuthenticated && !isEmailVerified ? <VerifyEmail /> : <Navigate to="/home" />} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? (isEmailVerified ? "/home" : "/verify-email") : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
