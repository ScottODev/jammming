//import logo from './logo.svg'; <- Not sure if I will use this yet so commented out.
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './util/Spotify'; // Importing Spotify module for API calls

function App() {

  // State for playlist name and tracks
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

useEffect(() => {
  const checkConnection = async () => {
    // Check if we have a code in URL or existing token
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code || localStorage.getItem('code_verifier')) {
      console.log("Found auth code or verifier, attempting connection...");
      await connectToSpotify();
    }
  };
  
  checkConnection();
}, []);

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

const savePlaylist = async () => {
  console.log("Saving playlist:", playlistName);

  // Extract URIs from playlist tracks
  const trackUris = playlistTracks.map(track => track.uri);
  console.log("Track URIs to save:", trackUris);

  try {
    // Call Spotify API to save playlist
    const result = await Spotify.savePlaylist(playlistName, trackUris);
    
    if (result) {
      console.log("✅ Playlist saved to Spotify successfully!");
      alert(`Playlist "${playlistName}" saved to your Spotify account!`);
      
      // Reset playlist after successful save
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
    } else {
      console.error("❌ Failed to save playlist");
      alert("Failed to save playlist. Please try again.");
    }
  } catch (error) {
    console.error("Error saving playlist:", error);
    alert("Error saving playlist. Please try again.");
  }
};

  // Search function to fetch tracks from Spotify
  const search = (term) => {
    console.log("=== SEARCH DEBUG START ===");
    console.log("Search term:", term);
    
    Spotify.search(term)
      .then(searchResults => {
        console.log("SUCCESS:", searchResults);
        console.log("Number of results:", searchResults.length);
        setSearchResults(searchResults);
      })
      .catch(error => {
        console.error("Search failed:", error);
      });
  };

const connectToSpotify = async () => {
  try {
    const token = await Spotify.getAccessToken();
    if (token) {
      console.log("✅ Successfully connected to Spotify!");
      setIsConnected(true);
    }
  } catch (error) {
    console.error("❌ Failed to connect to Spotify:", error);
  }
};
  
  return (
    <div className="App">
      <h1>Jammming</h1>
    {!isConnected ? (
      <button onClick={connectToSpotify}>Connect to Spotify</button>
    ) : (
      <SearchBar onSearch={search}/>
    )}
      <div className="App-content">
        <SearchResults 
        tracks={searchResults}
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