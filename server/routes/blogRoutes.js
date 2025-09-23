const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createBlogPost, getAllBlogPosts, getBlogPostById, searchBlogPosts, updateBlogPost, deleteBlogPost } = require('../controllers/blogController');

// Create a new blog post (protected route)
router.post('/', authMiddleware, createBlogPost);

// Get all blog posts
router.get('/', getAllBlogPosts);

// Search blog posts
router.get('/search', searchBlogPosts);

// Get a single blog post by ID
router.get('/:id', getBlogPostById);

// Update a blog post (protected route)
router.put('/:id', authMiddleware, updateBlogPost);

// Delete a blog post (protected route)
router.delete('/:id', authMiddleware, deleteBlogPost);

module.exports = router;
