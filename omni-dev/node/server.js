const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();

const https = require('https');
const fs = require('fs');

const SPOTIFY_SCOPES = ['user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-read', 'user-library-modify'];
const SPOTIFY_REDIRECT_URI = 'https://api.omnimusic.co/callback';
const SPOTIFY_CLIENT_ID = '595ee53ede324126adcb3e2118c5ef7b';
const SPOTIFY_STATE = 'some-state-of-my-choice';
const SPOTIFY_SECRET = '4a0a262768454e249ac297aa50c74061';
const SPOTIFY_CREDENTIALS = {
    redirectUri: SPOTIFY_REDIRECT_URI,
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_SECRET,
};

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const USER_DATA_MAP = {

};

function getStandardSpotify() {
    return new SpotifyWebApi(SPOTIFY_CREDENTIALS);
}

function getNowTimeInSeconds() {
    return new Date().getTime() / 1000;
}

function getSpotifySigninURL(userId) {
	let spotifyApi = new SpotifyWebApi(SPOTIFY_CREDENTIALS);
	let authorizeURL = spotifyApi.createAuthorizeURL(SPOTIFY_SCOPES, userId);
	return authorizeURL;
}

async function handleCallback(code, state) {
        let standardSpotify = getStandardSpotify();
        let userData = await standardSpotify.authorizationCodeGrant(code).then(
            async function (data) {
                let expiresIn = data.body['expires_in'];
                let accessToken = data.body['access_token'];
                let refreshToken = data.body['refresh_token'];
                USER_DATA_MAP[state] = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_after: getNowTimeInSeconds() + expiresIn
                };
                return USER_DATA_MAP[state];
            }
        );
        return userData;
}

function spotifyCallback(req, res) {
    let code = req.query.code || null;
	let state = req.query.state || null;
	if (state === null) {
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			}));
	} else {
        console.log("HANDLING CALLBBACK OF " + state);
		handleCallback(code, state).then((userData) => {
            console.log(USER_DATA_MAP[state]);
            console.log(userData);
            // console.log(USER_DATA_MAP);
			res.redirect("https://omnimusic.co/omni-dev/app/index.html?state=" + state);
		});
	}
}


async function getSpotifyUser(userId) { // user id is vague
    let spotify = getStandardSpotify();
    spotify.setAccessToken(USER_DATA_MAP[userId].access_token);
    spotify.setRefreshToken(USER_DATA_MAP[userId].access_token);
    return spotify;
}

app.get("/login", async function (req, res) {
    let userId = req.query.id;
    console.log("GOT A LOGIN FOR " + userId);
    if(USER_DATA_MAP.hasOwnProperty(userId) || (USER_DATA_MAP[userId] !== null && USER_DATA_MAP[userId] !== undefined)) {
        if(USER_DATA_MAP[userId].expires_after <= getNowTimeInSeconds()) {
            USER_DATA_MAP[userId] = null;
            console.log("EXPIRED!!");
        }
        else{
            res.send(USER_DATA_MAP[userId].access_token);
            return;
        }
    }
    res.send(getSpotifySigninURL(userId));
});

app.get('/callback', async function(req, res) {
    spotifyCallback(req, res);
});


let httpsServer = https.createServer({
    key: fs.readFileSync("./certs/private.key"),
    cert: fs.readFileSync("./certs/certificate.crt"),
    ca: [
        fs.readFileSync("./certs/ca_bundle.crt")
    ]
}, app).listen(443, function() {
    let host = httpsServer.address().address
    let port = httpsServer.address().port
    console.log("StreetShare server online available at port [:%s]", port)
});
