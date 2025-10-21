const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');
const connectDB = require('./server/config/db');

// Load environment variables
dotenv.config({ path: './server/.env' });

const verifyUser = async (username) => {
  try {
    // Connect to MongoDB using the same method as server.js
    await connectDB();
    
    // Find the user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User with username "${username}" not found`);
      return;
    }
    
    console.log(`Found user: ${user.username}, Email: ${user.email}, Verified: ${user.isVerified}`);
    
    // Update the user's verification status
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();
    
    console.log(`User "${username}" has been successfully verified!`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get username from command line arguments
const username = process.argv[2];

if (!username) {
  console.log('Please provide a username as an argument');
  console.log('Usage: node verify-user.js <username>');
  process.exit(1);
}

verifyUser(username);
