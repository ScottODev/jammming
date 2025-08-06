import React from 'react';
import TrackList from './TrackList';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
  return (
    <div>
      <h2>{playlistName}</h2>
      <input 
        value={playlistName}
        onChange={(e) => onNameChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => {
          if (e.target.value.trim() === '') {
            onNameChange('New Playlist');
        }
    }}
      />
      <TrackList tracks={playlistTracks} onRemove={onRemove} />
      <button onClick={onSave}>Save to Spotify</button>
    </div>
  );
}

export default Playlist;
