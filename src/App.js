//import logo from './logo.svg'; <- Not sure if I will use this yet so commented out.
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './util/Spotify'; // Importing Spotify module for API calls

function App() {

  // STATE MANAGEMENT

  // Playlist state
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  
  // Search functionality state
  const [searchResults, setSearchResults] = useState([]);
  
  // Authentication state
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // SPOTIFY AUTHENTICATION

  /**
   * Connects to Spotify using PKCE OAuth flow
   * Gets user access token and fetches user profile info
   */
  const connectToSpotify = async () => {
    try {
      const token = await Spotify.getAccessToken();
      if (token) {
        console.log("✅ Successfully connected to Spotify!");
        
        // Fetch user profile information
        const user = await Spotify.getUserInfo();
        setUserInfo(user);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("❌ Failed to connect to Spotify:", error);
    }
  };

  /**
   * Check if user is already authenticated on page load
   * Runs once when component mounts
   */
  useEffect(() => {
    const checkConnection = async () => {
      // Check if we have authorization code in URL or stored verifier
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
  
  /**
   * Adds a track to the user's custom playlist
   * Prevents duplicate tracks from being added
   * @param {Object} track - Track object containing id, name, artist, album, uri
   */
  const addTrack = (track) => {
    // Check for duplicates before adding
    const isTrackInPlaylist = playlistTracks.some(
      playlistTrack => playlistTrack.id === track.id
    );

    if (!isTrackInPlaylist) {
      // Use spread operator to create new array (immutable update)
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  /**
   * Removes a track from the user's custom playlist
   * @param {Object} track - Track object to remove
   */
  const removeTrack = (track) => {
    console.log("removeTrack called with:", track); // Debugging
    
    // Filter out the track with matching ID (immutable update)
    setPlaylistTracks(
      playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    );
  };

  /**
   * Updates the playlist name
   * @param {string} name - New playlist name
   */
  const updatePlaylistName = (name) => {
    console.log("updatePlaylistName called with:", name); // Debugging
    setPlaylistName(name);
  };

  /**
   * Saves the current playlist to user's Spotify account
   * Creates new playlist and adds all tracks to it
   * Resets local playlist after successful save
   */
  const savePlaylist = async () => {
    console.log("Saving playlist:", playlistName);

    // Extract Spotify URIs from track objects
    const trackUris = playlistTracks.map(track => track.uri);
    console.log("Track URIs to save:", trackUris);

    try {
      // Call Spotify API to create playlist and add tracks
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

  // SEARCH FUNCTIONALITY
  
  /**
   * Searches Spotify's music library for tracks
   * @param {string} term - Search query entered by user
   */
  const search = (term) => {
    console.log("=== SEARCH DEBUG START ===");
    console.log("Search term:", term);
    
    // Call Spotify API search method
    Spotify.search(term)
      .then(searchResults => {
        console.log("SUCCESS:", searchResults);
        console.log("Number of results:", searchResults.length);
        
        // Update search results state
        setSearchResults(searchResults);
      })
      .catch(error => {
        console.error("Search failed:", error);
      });
  };

  // RENDER UI
  
  return (
    <div className="App">
      {/* Header with logo and user info */}
      <header className="app-header">
        <h1 className="app-title">jammming</h1>
        
        {/* Show user info only when connected */}
        {isConnected && userInfo && (
          <div className="user-info">
            {/* User avatar (if available) */}
            {userInfo.imageUrl && (
              <img src={userInfo.imageUrl} alt="User" className="user-avatar" />
            )}
            
            {/* User details */}
            <div className="user-details">
              <h3>{userInfo.name}</h3>
              <p>Connected to Spotify</p>
            </div>
            
            {/* Logout button */}
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

      {/* Main content - show different UI based on connection status */}
      {!isConnected ? (
        // ===== NOT CONNECTED: Show welcome screen =====
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
        // ===== CONNECTED: Show main app interface =====
        <>
          {/* Welcome section with search */}
          <div className="welcome-section">
            <h2 className="welcome-title">Hey</h2>
            <h2 className="welcome-name">
              {userInfo?.name || 'music lover'}
            </h2>
            <p className="welcome-description">
              Browse Spotify by title, artist or both. Then join your favorites 
              into a newly created list that you can add to your account.
            </p>
            
            {/* Search bar */}
            <div className="search-section">
              <SearchBar onSearch={search}/>
            </div>
          </div>

          {/* Main content grid with search results and playlist */}
          <div className="App-content">
            {/* Search Results Card */}
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

            {/* Playlist Card */}
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
        </>
      )}
    </div>
  );
}

export default App;