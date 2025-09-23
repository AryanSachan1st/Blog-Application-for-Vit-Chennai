import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import blogService from '../services/blogService';

const BlogItem = ({ blogPost }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if the logged-in user is the author of the blog post
  const isAuthor = user && blogPost.author && user._id === blogPost.author._id;

  const handleEdit = () => {
    // Navigate to edit page
    navigate(`/blog/${blogPost._id}/edit`);
  };

  const handleDelete = async () => {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlogPost(blogPost._id);
        // Reload the page to reflect the deletion
        window.location.reload();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  return (
    <div className="blog-item-container">
      <Link to={`/blog/${blogPost._id}`} className="blog-item-link">
        <div className="blog-item">
          <h3>{blogPost.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            {blogPost.body.substring(0, 150)}...
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <p className="blog-date">Last updated at: {new Date(blogPost.updatedAt).toLocaleString()}</p>
            <p className="blog-author">By: {blogPost.author?.username || 'Unknown Author'}</p>
          </div>
        </div>
      </Link>
      {isAuthor && (
        <div className="blog-item-actions">
          <button className="edit-button" onClick={handleEdit}>Edit</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default BlogItem;
