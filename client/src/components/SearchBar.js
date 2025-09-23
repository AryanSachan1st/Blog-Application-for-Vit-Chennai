import React, { useState } from 'react';

const SearchBar = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, 1); // Reset to page 1 when searching
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear(1); // Reset to page 1 when clearing search
  };

  return (
    <div className="search-bar">
      <h3>Search Blog Posts</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </form>
    </div>
  );
};

export default SearchBar;
