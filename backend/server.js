require('dotenv').config({ path: './dotenv.env' });  // Load custom .env file if needed
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const topicsRoutes = require('./routes/topicsRoutes');

// Import Middleware
const protectRoute = require('./middleware/protectRoute');

const app = express();

app.use(morgan('dev'));  // Logs incoming requests to the console

// Middleware setup

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's domain
  credentials: true,  // Allow cookies to be sent and received
};

app.use(cors(corsOptions));  // Apply CORS configuration to all routes
app.use(cookieParser());  // Parse cookies
app.use(express.json());  // Parse incoming JSON requests

app.use(express.urlencoded({ extended: true })); // 🔹 Allows form data parsing
// app.use(cors({
//   origin: process.env.CLIENT_URL, // Allow frontend requests (e.g., http://localhost:3000)
//   credentials: true, // Allow cookies in requests
// }));



// Connect to MongoDB

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Welcome Route (for testing the server)
app.get('/', (req, res) => {
  res.send('Welcome to the Discussion Forum API');
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Debugging token reception and headers
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);  // Debug: Log request headers
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  console.log('Token received in server.js:', token);  // Debugging: Log the token received
  console.log('Cookies received in request:', req.cookies);

  next();  // Proceed to the next middleware
});

// Topic Routes (Protected)
app.use('/api/topics', protectRoute, topicsRoutes);  // Protect topic routes with the middleware

// Global Error Handler (for unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});



// Serve Frontend (Optional: only in production)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'frontend', 'build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//   });
// }

// Start Server on the specified port (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
