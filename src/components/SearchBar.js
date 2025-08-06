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
    <div>
      <input 
      placeholder="Enter A Song, or Artist" 
      value={term}
      onChange={handleTermChange}
      />
      <button onClick={search}>Search</button>
    </div>
  );
}

export default SearchBar;