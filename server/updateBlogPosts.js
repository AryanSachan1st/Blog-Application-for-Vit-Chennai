const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const updateBlogPosts = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Update all blog posts that don't have a source field
    const result = await Blog.updateMany(
      { source: { $exists: false } },
      { $set: { source: 'self created blog-post' } }
    );
    
    console.log(`Updated ${result.modifiedCount} blog posts`);
    
    // Verify the update by fetching all posts
    const posts = await Blog.find();
    console.log('All blog posts after update:');
    posts.forEach(post => {
      console.log(`- ${post.title}: ${post.source}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating blog posts:', error);
    process.exit(1);
  }
};

updateBlogPosts();
