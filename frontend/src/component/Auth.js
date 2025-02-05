import React, { useState } from 'react';
import { login, register } from '../api/auth';
import Cookies from 'js-cookie';

const Auth = ({ isLogin, onAuthSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    try {
      let response;
      if (isLogin) {
        response = await login(formData.email, formData.password);
      } else {
        response = await register(formData.username, formData.email, formData.password);
      }
  
      // Ensure response is valid before accessing properties
      if (!response || !response.message) {
        throw new Error('Invalid response from server');
      }
  
      // Check if login was successful
      console.log("Server response:", response.message);

       // Set the token in the cookies with the necessary options
       Cookies.set('token', response.token, { expires: 1, path: '/', SameSite: 'None', secure: true });
      
      // Display success message
      setMessage(isLogin ? 'Login successful!' : 'Registration successful! Please log in.');
  
      // Proceed if login is successful
      if (isLogin) {
        onAuthSuccess();  // Trigger callback to update UI or route
      }
    } catch (err) {
      console.log('Error object:', err);
      setError(err.message || 'An error occurred');
    }
  };
  
  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>

      <p onClick={() => onAuthSuccess()}>
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </p>
    </div>
  );
};

export default Auth;
