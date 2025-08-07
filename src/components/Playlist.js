import React from 'react';
import TrackList from './TrackList';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
  return (
    <div className="playlist-container">
      <input 
        className="playlist-name-input"
        value={playlistName} 
        onChange={(e) => onNameChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => {
          if (e.target.value.trim() === '') {
            onNameChange('New Playlist');
          }
        }}
        placeholder="Enter playlist name..."
      />
      
      <div className="playlist-tracks">
        {playlistTracks.length > 0 ? (
          <TrackList tracks={playlistTracks} onRemove={onRemove} />
        ) : (
          <div className="empty-state">
            Add songs to your playlist by clicking the + button on search results
          </div>
        )}
      </div>
      
      <div className="playlist-actions">
        <button 
          className="save-btn"
          onClick={onSave}
          disabled={playlistTracks.length === 0}
        >
          🎵 Save to Spotify
        </button>
      </div>
    </div>
  );
}

export default Playlist;