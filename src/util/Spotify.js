const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'https://scottodev.github.io/jammming/';

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token in the URL
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    const token = urlParams.get('access_token');
    const expiresIn = urlParams.get('expires_in');

    if (token) {
      accessToken = token;
      // Clear the hash from URL
      window.history.pushState({}, document.title, window.location.pathname);
      // Set expiration
      setTimeout(() => { accessToken = null; }, expiresIn * 1000);
      return accessToken;
    }

    // If no token, redirect to Spotify
    const scopes = 'user-read-private playlist-modify-public playlist-modify-private';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&show_dialog=true`;
  },

  search(term) {
  const token = Spotify.getAccessToken();
  
  if (!token) {
    return Promise.resolve([]);
  }

  const url = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`;
  console.log("Search URL:", url);
  console.log("Using token:", token);

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    console.log("Response status:", response.status);
    return response.json();
  })
  .then(data => {
    console.log("Full Spotify response:", data);
    if (!data.tracks) return [];
    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  })
  .catch(error => {
    console.error('Search error:', error);
    return [];
  });
}
};

export default Spotify;