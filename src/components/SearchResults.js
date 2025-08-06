import React from 'react';
import TrackList from './TrackList';

function SearchResults({ tracks, onAdd }) {
  if (tracks.length === 0) { // If no songs are found, display message below
    return (
      <div>
        <h2>Search Results</h2>
        <p>No songs found. Try a different search!</p>
      </div>
    );
  }

  return ( // If songs are found, display below.
    <div>
      <h2>Search Results</h2>
      <TrackList tracks={tracks} onAdd={onAdd} />
    </div>
  );
}

export default SearchResults;