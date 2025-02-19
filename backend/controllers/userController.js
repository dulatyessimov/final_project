const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Session = require('../models/Session');

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed Password Before Saving:", hashedPassword);

    // Create and save new user
    //    const newUser = new User({ username, email, password: hashedPassword });
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
};

// Login User with Session Management
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials(not found user)(userController)' });

    console.log("Stored hash:", user?.password);
    console.log("Entered password:", password);


    // Verify password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials(wrong password)(userController)' });
    }

    // Invalidate previous sessions
    await Session.updateMany({ userId: user._id, isActive: true }, { isActive: false });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '86400000' });
    console.log('Generated JWT token:', token); // Debugging

    // Save session
    if (token) {
      const session = new Session({ userId: user._id, token });
      await session.save();
      console.log('Session saved with token:', token); // Debugging
    } else {
      return res.status(500).json({ error: 'Failed to generate token' });
    }

    // Send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure:true,
      // secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'none',
      maxAge: 86400000,
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.log('Error during login:', err.message);
    res.status(500).json({ error: 'Error logging in(userController)', details: err.message });
  }
};

// Logout User (Clears Cookie and Deactivates Session)
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      // Deactivate session
      await Session.findOneAndUpdate({ token }, { isActive: false });
      console.log('Session deactivated for token:', token);  // Debugging session deactivation
    }

    // Clear the cookie
    res.clearCookie('token');
    console.log('Token cookie cleared');  // Debugging cookie clearing
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error logging out(userController)', details: err.message });
  }
};

// 🔹 Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user(userController)' });
  }
};

// Authentication Middleware (Validates JWT Token)
const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) { 
    console.log(' No token found in cookies(userController)');
    res.status(401).json({ error: 'Authentication required(userController)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    // Check if session is active
    const session = await Session.findOne({ userId: req.user._id, token, isActive: true });
    if (!session) { 
      console.log('❌ Session expired. Please log in again.(userController)');
      res.status(401).json({ error: 'Session expired. Please log in again.(userController)' });
    }

    next();
  } catch (err) {
    console.log('❌ Invalid or expired token:(userController)', err.message);
    res.status(401).json({ error: 'Invalid or expired token(userController)' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authenticateUser, getCurrentUser };
