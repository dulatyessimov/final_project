const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedUsers = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Hash passwords
    const hashedPasswordAdmin = await bcrypt.hash('adminPassword123', 10);
    const hashedPasswordUser = await bcrypt.hash('userPassword123', 10);

    // User data
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPasswordAdmin,
        role: 'admin',
      },
      {
        username: 'primaryUser',
        email: 'user@example.com',
        password: hashedPasswordUser,
        role: 'primary user',
      },
    ];

    // Insert users into the collection
    await User.insertMany(users);
    console.log('Users seeded successfully');

    // Close database connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding users:', err.message);

    // Ensure the database connection is closed on error
    mongoose.connection.close();
  }
};

// Execute the script
seedUsers();
