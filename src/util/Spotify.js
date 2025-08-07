const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Stored securely
const redirectUri = 'https://scottodev.github.io/jammming/'; // This is where Spotify will send the user back after authorization - Note if this changes, change on Spotify dev dashboard too

let accessToken; // Variable stores the token once retrieved

const Spotify = {
    getAccessToken() {

        if (accessToken) {
            return accessToken; // If token already exists, return it
        }

        // Check if access token is in URL (returning from Spotify)
        const currentUrl = window.location.href || '';
        const accessTokenMatch = currentUrl.match(/access_token=([^&]*)/);
        const expiresInMatch = currentUrl.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1]; // Storing the access token
            const expiresIn = Number(expiresInMatch[1]); // Get the expiration time

            // Clear parameters from URl and set token to expire
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/')

            return accessToken;
        } else {
            // Redirect to Spotify authorization page
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-read-private%20playlist-modify-public&redirect_uri=${redirectUri}`;
            console.log("Full authorization URL:", accessUrl);
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
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
};

export default Spotify;