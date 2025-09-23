const Blog = require('../models/Blog');
const mongoose = require('mongoose');

// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, body, source } = req.body;
    console.log('Received blog post data:', { title, body, source });

    // Create new blog post with automatic timestamps and associate with user
    const blogPost = new Blog({
      title,
      body,
      source,
      author: req.user._id
    });

    console.log('Created blog post object:', blogPost);
    
    // Save to database
    const savedBlogPost = await blogPost.save();
    
    console.log('Saved blog post to database:', savedBlogPost);

    res.status(201).json({
      success: true,
      data: savedBlogPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all blog posts with pagination
const getAllBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

const blogPosts = await Blog.find().populate('author', ['username', '_id']).skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalPosts = await Blog.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    console.log('Retrieved blog posts from database:', blogPosts);
    res.status(200).json({
      success: true,
      data: blogPosts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalPosts: totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error retrieving blog posts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single blog post by ID
const getBlogPostById = async (req, res) => {
  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid blog post ID'
      });
    }
    
    const blogPost = await Blog.findById(req.params.id).populate('author', ['username', '_id']);
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update a blog post by ID (protected route)
const updateBlogPost = async (req, res) => {
  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid blog post ID'
      });
    }
    
    const { title, body, source } = req.body;
    
    // Find the blog post by ID
    const blogPost = await Blog.findById(req.params.id);
    
    // Check if blog post exists
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    // Check if the logged-in user is the author of the blog post
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this blog post'
      });
    }
    
    // Update the blog post
    blogPost.title = title || blogPost.title;
    blogPost.body = body || blogPost.body;
    blogPost.source = source || blogPost.source;
    
    const updatedBlogPost = await blogPost.save();
    
    // Populate the author field to include username in the response
    await updatedBlogPost.populate('author', 'username');
    
    res.status(200).json({
      success: true,
      data: updatedBlogPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a blog post by ID (protected route)
const deleteBlogPost = async (req, res) => {
  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid blog post ID'
      });
    }
    
    // Find the blog post by ID
    const blogPost = await Blog.findById(req.params.id);
    
    // Check if blog post exists
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    // Check if the logged-in user is the author of the blog post
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this blog post'
      });
    }
    
    // Delete the blog post
    await Blog.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Search blog posts by keywords in title, body, or source with pagination
const searchBlogPosts = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    console.log('Search query received:', query);
    
    // If no query provided, return all blog posts with pagination
    if (!query) {
      const blogPosts = await Blog.find().populate('author', ['username', '_id']).skip(skip).limit(limit).sort({ createdAt: -1 });
      const totalPosts = await Blog.countDocuments();
      const totalPages = Math.ceil(totalPosts / limit);
      
      return res.status(200).json({
        success: true,
        data: blogPosts,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalPosts: totalPosts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    }
    
    // Split query into individual keywords and filter out empty strings
    const keywords = query.trim().split(/\s+/).filter(keyword => keyword.length > 0);
    
    // If no valid keywords after splitting, return all blog posts with pagination
    if (keywords.length === 0) {
      const blogPosts = await Blog.find().populate('author', ['username', '_id']).skip(skip).limit(limit).sort({ createdAt: -1 });
      const totalPosts = await Blog.countDocuments();
      const totalPages = Math.ceil(totalPosts / limit);
      
      return res.status(200).json({
        success: true,
        data: blogPosts,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalPosts: totalPosts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    }
    
    // Create search conditions - each keyword must match in at least one field (title, body, or source)
    const searchConditions = keywords.map(keyword => ({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { body: { $regex: keyword, $options: 'i' } },
        { source: { $regex: keyword, $options: 'i' } }
      ]
    }));
    
    // Search for blog posts matching all keywords in title, body, or source with pagination
    const blogPosts = await Blog.find({
      $and: searchConditions
    }).populate('author', ['username', '_id']).skip(skip).limit(limit).sort({ createdAt: -1 });
    
    const totalPosts = await Blog.countDocuments({
      $and: searchConditions
    });
    const totalPages = Math.ceil(totalPosts / limit);
    
    console.log('Search results:', blogPosts);
    res.status(200).json({
      success: true,
      data: blogPosts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalPosts: totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  searchBlogPosts,
  updateBlogPost,
  deleteBlogPost
};
