const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Blog routes
app.use('/api/blogs', blogRoutes);

// User routes
app.use('/api/users', userRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all route to serve index.html for any route that doesn't match API routes
// This is necessary for React Router to work properly in production
app.get('*', (req, res) => {
  console.log(`Serving index.html for: ${req.originalUrl}`);
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Use PORT from environment variables, default to 8080 (matching Dockerfile)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files served from: ${path.join(__dirname, '../client/build')}`);
});
