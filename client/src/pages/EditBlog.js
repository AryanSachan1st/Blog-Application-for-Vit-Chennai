import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import blogService from '../services/blogService';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [source, setSource] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await blogService.getBlogPostById(id);
        if (response.success) {
          const blogPost = response.data;
          
          // Check if the logged-in user is the author of the blog post
          if (user && blogPost.author && user.id === blogPost.author._id) {
            setIsAuthor(true);
            setTitle(blogPost.title);
            setBody(blogPost.body);
            setSource(blogPost.source || '');
          } else {
            setMessage('You are not authorized to edit this blog post.');
          }
        } else {
          setMessage('Error fetching blog post: ' + response.error);
        }
      } catch (error) {
        setMessage('Error fetching blog post: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchBlogPost();
    } else if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to edit a blog post.');
      return;
    }
    
    // Check if user is the author
    if (!isAuthor) {
      setMessage('You are not authorized to edit this blog post.');
      return;
    }
    
    try {
      const response = await blogService.updateBlogPost(id, { title, body, source });
      if (response.success) {
        setMessage('Blog post updated successfully!');
        // Redirect to blog detail page after 2 seconds to show the success message
        setTimeout(() => {
          navigate(`/blog/${id}`);
        }, 2000);
      } else {
        setMessage('Error updating blog post: ' + response.error);
      }
    } catch (error) {
      // Better error handling for network errors
      if (error.message) {
        setMessage('Error updating blog post: ' + error.message);
      } else {
        setMessage('Error updating blog post: Failed to fetch. Please check if the server is running.');
      }
    }
  };

  // If not authenticated, don't render the form
  if (!user) {
    return null;
  }

  if (loading) return <div className="edit-blog">Loading...</div>;
  
  if (!isAuthor) {
    return (
      <div className="edit-blog">
        <h2>Access Denied</h2>
        <p>{message || 'You are not authorized to edit this blog post.'}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="edit-blog">
      <h2>Edit Blog Post</h2>
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
        <button type="submit" className="auth-button">Update Blog Post</button>
      </form>
      {message && <p className="message">{message}</p>}
      <button onClick={() => navigate(`/blog/${id}`)} className="cancel-button">Cancel</button>
    </div>
  );
};

export default EditBlog;
