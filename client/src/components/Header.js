import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateBlogClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert('Please log in to create a blog post.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>Blog Website</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li>
              {user ? (
                <Link to="/create">Create Blog</Link>
              ) : (
                <button 
                  onClick={handleCreateBlogClick}
                  className="disabled-button"
                >
                  Create Blog
                </button>
              )}
            </li>
            {user ? (
              <li>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </li>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
