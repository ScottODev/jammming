const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Stored securely
const redirectUri = 'https://scottodev.github.io/jammming/'; // This is where Spotify will send the user back after authorization - Note if this changes, change on Spotify dev dashboard too

let accessToken; // Variable stores the token once retrieved

const Spotify = {
getAccessToken() {
    if (accessToken) {
        return accessToken;
    }

    // Check if access token is in URL
    const currentUrl = window.location.href || '';
    const accessTokenMatch = currentUrl.match(/access_token=([^&]*)/);
    const expiresInMatch = currentUrl.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
    } else {
        // Try with show_dialog to force permissions screen
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public%20playlist-modify-private%20user-read-private&redirect_uri=${redirectUri}&show_dialog=true`;
        console.log("Authorization URL:", accessUrl);
        window.location = accessUrl;
    }
},

search(term) {
    const accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors'  // Add this line
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(jsonResponse => {
        console.log("Search results:", jsonResponse);
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    });
  }
}

export default Spotify;