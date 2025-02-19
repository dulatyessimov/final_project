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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [loading, setLoading] = useState(true); // Prevent flickering on page load

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
        setIsEmailVerified(user?.emailVerified || true);
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

  if (loading) return <p>Loading...</p>; // Prevent unnecessary redirects while checking auth state

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

        {/* Protected Routes (Only for Authenticated & Verified Users) */}
        <Route path="/home" element={isAuthenticated && isEmailVerified ? <Home /> : <Navigate to="/verify-email" />} />
        <Route path="/topics" element={isAuthenticated && isEmailVerified ? <Topics /> : <Navigate to="/verify-email" />} />
        <Route path="/topics/:id" element={isAuthenticated && isEmailVerified ? <TopicContent /> : <Navigate to="/verify-email" />} />
        <Route path="/add-topic" element={isAuthenticated && isEmailVerified ? <AddTopic /> : <Navigate to="/verify-email" />} />
        <Route path="/edit-topic/:id" element={isAuthenticated && isEmailVerified ? <EditTopic /> : <Navigate to="/verify-email" />} />

        {/* Email Verification Route (Only for Authenticated but Unverified Users) */}
        <Route path="/verify-email" element={isAuthenticated && !isEmailVerified ? <VerifyEmail /> : <Navigate to="/home" />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? (isEmailVerified ? "/home" : "/verify-email") : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
