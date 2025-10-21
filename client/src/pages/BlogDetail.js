import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import blogService from '../services/blogService';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await blogService.getBlogPostById(id);
        if (response.success) {
          setBlogPost(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  if (loading) return <div className="blog-detail">Loading...</div>;
  if (error) return <div className="blog-detail">Error: {error}</div>;
  if (!blogPost) return <div className="blog-detail">Blog post not found.</div>;

  // Check if the logged-in user is the author of the blog post
  const isAuthor = user && blogPost.author && user.id === blogPost.author._id;

  const handleEdit = () => {
    // Navigate to edit page
    navigate(`/blog/${blogPost._id}/edit`);
  };

  const handleDelete = async () => {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlogPost(blogPost._id);
        // Navigate back to home page after deletion
        navigate('/');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  return (
    <div className="blog-detail">
      <h2>{blogPost.title}</h2>
      <div className="blog-meta">
        <p className="blog-source">
          Source: <a href={blogPost.source} target="_blank" rel="noopener noreferrer">{blogPost.source}</a>
        </p>
      </div>
      <div className="blog-content">{blogPost.body}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <p className="blog-author">By: {blogPost.author?.username || 'Unknown Author'}</p>
        <p className="blog-date">Last updated at: {new Date(blogPost.updatedAt).toLocaleString()}</p>
      </div>
      {isAuthor && (
        <div className="blog-detail-actions">
          <button className="edit-button" onClick={handleEdit}>Edit</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
