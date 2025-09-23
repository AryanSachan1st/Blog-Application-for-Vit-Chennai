import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [source, setSource] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      // Redirect to home page if not authenticated
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to create a blog post.');
      return;
    }
    
    try {
      const response = await blogService.createBlogPost({ title, body, source });
      if (response.success) {
        setMessage('Blog post created successfully!');
        setTitle('');
        setBody('');
        setSource('');
        // Redirect to home page after 2 seconds to show the success message
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage('Error creating blog post: ' + response.error);
      }
    } catch (error) {
      // Better error handling for network errors
      if (error.message) {
        setMessage('Error creating blog post: ' + error.message);
      } else {
        setMessage('Error creating blog post: Failed to fetch. Please check if the server is running.');
      }
    }
  };

  // If not authenticated, don't render the form
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="create-blog">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter blog post title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="body" className="form-label">Content</label>
          <textarea
            id="body"
            className="form-input"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder="Write your blog post content here..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="source" className="form-label">Source</label>
          <input
            type="text"
            id="source"
            className="form-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source (optional)"
          />
        </div>
        <button type="submit" className="auth-button">Submit Blog Post</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateBlog;
