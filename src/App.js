//import logo from './logo.svg'; <- Not sure if I will use this yet so commented out.
import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchBarResults from './components/SearchResults';
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
  return (
    <div className="App">
      <h1>Jammming</h1>
      <SearchBar />
      <div className="App-content">
        <SearchBarResults tracks={mockTracks}/>
        <Playlist />
      </div>
    </div>
  )
};

export default App;
