import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const search = () => {
    onSearch(term);
  };

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  return (
    <div className="search-container">
      <input 
        className="search-input"
        placeholder="Enter A Song, or Artist" 
        value={term}
        onChange={handleTermChange}
      />
      <button className="search-button" onClick={search}>
        <span className="search-icon">🔍</span>
      </button>
    </div>
  );
}

export default SearchBar;