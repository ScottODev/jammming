//import logo from './logo.svg'; <- Not sure if I will use this yet so commented out.
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';

const mockTracks = [ // Temporary manual tracks array.
  {
    id: 1,
    name: 'Blinding Lights',
    artist: 'The Weekend',
    album: 'After Hours'
  },
  {
    id: 2,
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
  },
  {
    id: 3,
    name: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
  }
];

function App() {

  // State for playlist name and tracks
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const addTrack = (track) => {
    // Checking for duplicates BEFORE adding a track
    const isTrackInPlaylist = playlistTracks.some(playlistTrack => playlistTrack.id === track.id);

    if (!isTrackInPlaylist) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  return (
    <div className="App">
      <h1>Jammming</h1>
      <SearchBar />
      <div className="App-content">
        <SearchResults tracks={mockTracks}/>
        <Playlist 
        playlistName={playlistName}
        playlistTracks={playlistTracks}
        />
      </div>
    </div>
  )
};

export default App;
