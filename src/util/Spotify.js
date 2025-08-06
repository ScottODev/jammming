const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Stored securely
const redirectUri = 'https://scottodev.github.io/jammming/'; // This is where Spotify will send the user back after authorization - Note if this changes, change on Spotify dev dashboard too

let accessToken; // Variable stores the token once retrieved

const Spotify = {
    getAccessToken() {

        console.log("Client ID being used:", clientId);
        console.log("Redirect URI being used:", redirectUri);

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
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-read-private&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
      }
    }
};

export default Spotify;