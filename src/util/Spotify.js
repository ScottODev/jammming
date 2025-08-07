const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'https://scottodev.github.io/jammming/';

let accessToken;

// Generate code verifier and challenge for PKCE
function generateCodeChallenge() {
  const array = new Uint32Array(56/2);
  window.crypto.getRandomValues(array);
  const codeVerifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  
  // Store in localStorage so it survives page reload
  localStorage.setItem('code_verifier', codeVerifier);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  return window.crypto.subtle.digest('SHA-256', data).then(digest => {
    const bytes = new Uint8Array(digest);
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  });
}

const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check if we have an authorization code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const storedCodeVerifier = localStorage.getItem('code_verifier');

    if (code && storedCodeVerifier) {
      console.log("=== TOKEN EXCHANGE DEBUG ===");
      console.log("Authorization code:", code);
      console.log("Code verifier exists:", !!storedCodeVerifier);
      
      // Exchange code for token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          code_verifier: storedCodeVerifier,
        }),
      });

      console.log("Token response status:", response.status);
      const data = await response.json();
      console.log("Token response data:", data);
      
      if (data.access_token) {
        accessToken = data.access_token;
        console.log("✅ Token saved successfully!");
        // Clean up
        localStorage.removeItem('code_verifier');
        window.history.replaceState({}, document.title, window.location.pathname);
        // Set expiration
        setTimeout(() => { accessToken = null; }, data.expires_in * 1000);
        return accessToken;
      } else {
        console.error("❌ No access token in response:", data);
      }
    }

    // No code or token, start PKCE flow
    const codeChallenge = await generateCodeChallenge();
    const scope = 'user-read-private playlist-modify-public playlist-modify-private';
    
    const authUrl = `https://accounts.spotify.com/authorize?` + new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      scope: scope,
    });

    window.location.href = authUrl;
  },

  async search(term) {
    const token = await Spotify.getAccessToken();
    
    if (!token) {
      return [];
    }

    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!data.tracks) return [];
    
    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  },

  async getUserId() {
    const token = await this.getAccessToken();
    
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.id;
    } else {
      console.error("Failed to fetch user ID:", response.status);
      return null;
    }
  },

  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) {
      console.log("No playlist name or tracks to save");
      return;
    }

    console.log("=== SAVING PLAYLIST TO SPOTIFY ===");
    console.log("Playlist name:", playlistName);
    console.log("Track URIs:", trackUris);

    try {
      // Get user ID
      const userId = await this.getUserId();
      console.log("User ID:", userId);

      // Create playlist
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'Created with Jammming app',
          public: false
        })
      });

      const playlist = await createResponse.json();
      console.log("Created playlist:", playlist);

      // Add tracks to playlist
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      });

      const addResult = await addTracksResponse.json();
      console.log("Added tracks result:", addResult);
      
      return playlist;

    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  }
};

export default Spotify;