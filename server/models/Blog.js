const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'self created blog-post'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt fields
  collection: 'posts' // Specify the collection name
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
