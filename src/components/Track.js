import React from 'react';

function Track({ track, onAdd, onRemove }) {
  return (
    <div className="track-item">
      <div className="track-info">
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {onAdd && (
        <button className="track-btn add-btn" onClick={() => onAdd(track)}>
          +
        </button>
      )}
      {onRemove && (
        <button className="track-btn remove-btn" onClick={() => onRemove(track)}>
          -
        </button>
      )}
    </div>
  );
}

export default Track;