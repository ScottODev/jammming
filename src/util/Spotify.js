const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Note to self, do not share looool
const redirectUri = 'https://localhost:3000/'; // This is where Spotify will send the user back after authorization - Note if this changes, change on Spotify dev dashboard too

let accessToken; // Variable stores the token once retrieved

const Spotify = {
    getAccessToken() {
        // This will handle getting the access token
    }
};

export default Spotify;