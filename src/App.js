// import logo from './logo.svg'; // Not used yet
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './util/Spotify'; // Importing Spotify module for API calls

function App() {
  // STATE MANAGEMENT
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // SPOTIFY AUTHENTICATION
  const connectToSpotify = async () => {
    try {
      const token = await Spotify.getAccessToken();
      if (token) {
        console.log("✅ Successfully connected to Spotify!");
        const user = await Spotify.getUserInfo();
        setUserInfo(user);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("❌ Failed to connect to Spotify:", error);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code || localStorage.getItem('code_verifier')) {
        console.log("Found auth code or verifier, attempting connection...");
        await connectToSpotify();
      }
    };
    checkConnection();
  }, []);

  // PLAYLIST MANAGEMENT
  const addTrack = (track) => {
    const isTrackInPlaylist = playlistTracks.some(
      playlistTrack => playlistTrack.id === track.id
    );
    if (!isTrackInPlaylist) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks(
      playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    );
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = async () => {
    const trackUris = playlistTracks.map(track => track.uri);
    try {
      const result = await Spotify.savePlaylist(playlistName, trackUris);
      if (result) {
        alert(`Playlist "${playlistName}" saved to your Spotify account!`);
        setPlaylistName('New Playlist');
        setPlaylistTracks([]);
      } else {
        alert("Failed to save playlist. Please try again.");
      }
    } catch (error) {
      alert("Error saving playlist. Please try again.");
    }
  };

  // SEARCH FUNCTIONALITY
  const search = (term) => {
    Spotify.search(term)
      .then(searchResults => {
        setSearchResults(searchResults);
      })
      .catch(error => {
        console.error("Search failed:", error);
      });
  };

  // RENDER UI
  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">jammming</h1>
        {isConnected && userInfo && (
          <div className="user-info">
            {userInfo.imageUrl && (
              <img src={userInfo.imageUrl} alt="User" className="user-avatar" />
            )}
            <div className="user-details">
              <h3>{userInfo.name}</h3>
              <p>Connected to Spotify</p>
            </div>
            <button 
              className="logout-btn" 
              onClick={() => {
                setIsConnected(false);
                setUserInfo(null);
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      {!isConnected ? (
  <div className="welcome-section">
    <h2 className="welcome-title">Hey</h2>
    <h2 className="welcome-name">music lover</h2>
    <p className="welcome-description">
      Browse Spotify by title, artist or both. Then join your favorites 
      into a newly created list that you can add to your account.
    </p>
    <button onClick={connectToSpotify} className="connect-btn">
      Connect to Spotify
    </button>
  </div>
) : (
  <div className="App-content">
    {/* Left sidebar with user info and search */}
    <div className="welcome-section sidebar">
      <h2 className="welcome-title">Hey</h2>
      <h2 className="welcome-name">
        {userInfo?.name || 'music lover'}
      </h2>
      <p className="welcome-description">
        Browse Spotify by title, artist or both. Then join your favorites 
        into a newly created list that you can add to your account.
      </p>
      
      <div className="search-section">
        <SearchBar onSearch={search}/>
      </div>
    </div>

    {/* Center - Search Results */}
    <div className="results-card">
      <div className="card-header">
        <h2 className="card-title">Results</h2>
      </div>
      <div className="card-content">
        <SearchResults 
          tracks={searchResults} 
          onAdd={addTrack}
        />
      </div>
    </div>

    {/* Right - Playlist */}
    <div className="playlist-card">
      <div className="card-header">
        <h2 className="card-title">Your List</h2>
      </div>
      <div className="card-content">
        <Playlist 
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;
