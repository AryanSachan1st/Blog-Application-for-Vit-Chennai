import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCreateBlogClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert('Please log in to create a blog post.');
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('Successfully logged out');
    setTimeout(() => {
      setMessage('');
      navigate('/');
    }, 2000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

return (
    <header className="header">
      <div className="header-content">
        <h1>Blog Website</h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={isMenuOpen ? 'active' : ''}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li>
              {user ? (
                <Link to="/create" onClick={closeMenu}>Create Blog</Link>
              ) : (
                <button 
                  onClick={(e) => {
                    handleCreateBlogClick(e);
                    closeMenu();
                  }}
                  className="disabled-button"
                >
                  Create Blog
                </button>
              )}
            </li>
            {user ? (
              <li>
                <button onClick={() => {
                  handleLogout();
                  closeMenu();
                }} className="logout-button">Logout</button>
              </li>
            ) : (
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
            )}
            <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          </ul>
        </nav>
      </div>
      {message && (
        <div className="message success">
          {message}
        </div>
      )}
    </header>
  );
};

export default Header;
