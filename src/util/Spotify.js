const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'https://scottodev.github.io/jammming/';

let accessToken;
let codeVerifier;

// Generate code verifier and challenge for PKCE
function generateCodeChallenge() {
  const array = new Uint32Array(56/2);
  window.crypto.getRandomValues(array);
  codeVerifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  
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

    if (code && codeVerifier) {
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
          code_verifier: codeVerifier,
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        accessToken = data.access_token;
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Set expiration
        setTimeout(() => { accessToken = null; }, data.expires_in * 1000);
        return accessToken;
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
  }
};

export default Spotify;