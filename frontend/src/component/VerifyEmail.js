import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth'; // Your existing API call
import { auth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from '../firebaseConfig';

const actionCodeSettings = {
      url: 'https://backend-db821.web.app/verify-email', // Redirect after verification
//    url: 'https://localhost:3000/verify-email', // Redirect after verification
  handleCodeInApp: true,
};

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const userData = await getCurrentUser();
        setEmail(userData.email);
      } catch (error) {
        setMessage("Failed to get email");
      }
    };

    fetchEmail();
  }, []);

  const sendVerificationEmail = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email); // Store email for later verification
      setMessage("Verification email sent! Check your inbox.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const checkEmailVerification = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = localStorage.getItem('emailForSignIn');

      if (!storedEmail) {
        setMessage("Email not found. Please enter your email again.");
        return;
      }

      try {
        await signInWithEmailLink(auth, storedEmail, window.location.href);
        localStorage.removeItem('emailForSignIn');
        setMessage("Email verified successfully!");
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  useEffect(() => {
    checkEmailVerification();
  }, []);

  return (
    <div>
      <h2>Verify Your Email</h2>
      <p>Email: {email}</p>
      <button onClick={sendVerificationEmail} disabled={!email}>Send Verification Email</button>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
