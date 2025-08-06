//import logo from './logo.svg'; <- Not sure if I will use this yet so commented out.
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './util/Spotify'; // Importing Spotify module for API calls

const mockTracks = [ // Temporary manual tracks array.
  {
    id: 1,
    name: 'Blinding Lights',
    artist: 'The Weekend',
    album: 'After Hours',
    uri: 'spotify:track:0VjIjW4GlULA6NkVLG6uiX'
  },
  {
    id: 2,
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    uri: 'spotify:track:463CkQjx2Zk1yXoBuierM9'
  },
  {
    id: 3,
    name: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    uri: 'spotify:track:6UelLqGlWMcVH1E5c4H7lY'
  }
];

function App() {

  // State for playlist name and tracks
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);


// Adding song to playlist feature 
  const addTrack = (track) => {
    // Checking for duplicates BEFORE adding a track
    const isTrackInPlaylist = playlistTracks.some(playlistTrack => playlistTrack.id === track.id);

    if (!isTrackInPlaylist) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

// Removing song from playlist feature
  const removeTrack = (track) => {
    console.log("removeTrack called with:", track); // Debugging line
    setPlaylistTracks(playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id));
  }

// Update playlist name feature
  const updatePlaylistName = (name) => {
    console.log("updatePlaylistName called with:", name); // Debugging line
    setPlaylistName(name);
  }

  const savePlaylist = () => {
    console.log("Saving playlist:", playlistName);

   // Extract URIs from playlist tracks
   const trackUris = playlistTracks.map(track => track.uri);
    console.log("Track URIs to save:", trackUris);

   // I will call the Spotify API here.
   console.log(`Saving playlist "${playlistName}" with ${trackUris.length} tracks`);

   // Reset playlist after saving
   setPlaylistName('New Playlist');
   setPlaylistTracks([]);

   console.log("Playlist reset complete.");
  };

  return (
    <div className="App">
      <h1>Jammming</h1>
      <button onClick={() => Spotify.getAccessToken()}>Test Spotify Login</button>
      <SearchBar />
      <div className="App-content">
        <SearchResults 
        tracks={mockTracks}
        onAdd={addTrack}
        />
        <h1>Your Playlist:</h1>
        <Playlist 
        onNameChange={updatePlaylistName}
        playlistName={playlistName}
        playlistTracks={playlistTracks}
        onRemove={removeTrack}
        onSave={savePlaylist}
        />
      </div>
    </div>
  )
};

export default App;
