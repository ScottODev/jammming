import React from 'react';
import TrackList from './TrackList';

function Playlist() {
  return (
    <div>
      <h2>My Playlist</h2>
      <input defaultValue="New Playlist" />
      <TrackList />
      <button>Save to Spotify</button>
    </div>
  );
}

export default Playlist;
