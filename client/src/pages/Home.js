import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import BlogList from '../components/BlogList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchBlogPosts = async (page = 1) => {
    try {
      const response = await blogService.getAllBlogPosts(page);
      if (response.success) {
        setBlogPosts(response.data);
        setPagination(response.pagination);
        setCurrentPage(page);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts(currentPage);
  }, [currentPage]);

  const handleSearch = async (query, page = 1) => {
    setLoading(true);
    try {
      const response = await blogService.searchBlogPosts(query, page);
      if (response.success) {
        setBlogPosts(response.data);
        setPagination(response.pagination);
        setCurrentPage(page);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    fetchBlogPosts(page);
  };

  const handleClearSearch = async (page = 1) => {
    setLoading(true);
    await fetchBlogPosts(page);
  };

  if (loading) return <div className="home">Loading...</div>;
  if (error) return <div className="home">Error: {error}</div>;

  return (
    <div className="home">
      <h2>Welcome to the Blog Website</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>
        Discover and share amazing blog posts on various topics.
      </p>
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      <BlogList blogPosts={blogPosts} />
      {pagination.totalPages > 1 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default Home;
