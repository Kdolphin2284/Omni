// EXTENSION TO FILE BELOW
// node \Users\kdolp\OneDrive\Documents\GitHub\Omni\musicbrainz-api\app.js

const express = require('express');
const app = express();
const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;
const cors = require('cors');


app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    }
}));

const PORT = 3000;

const api = new MusicBrainzApi({
    appName: 'test-app',
    appVersion: '0.1.0',
    appContactInfo: 'kdolphin2284@gmail.com'
}); 


app.listen(PORT, (error) => { // start an HTTP server on http://localhost:{PORT} (3000 as defined above)
    if(!error) { // if no error then:
        console.log("Server successfully started and listening on port " + PORT);
    }
    else{ // if there is an error:
        console.log("Failed to start server.");
    }
});


//define our "API" endpoints 
app.get('/data', async (request, response) => { // http://localhost:3000/data
    let artistId = request.query.id; // http://localhost:3000/data?id={ARTIST UUID FROM SEARCH}
    let artistResult = await api.lookupArtist(artistId); // api call to music brainz to get artist by UUID
    response.send(artistResult); // send result from MusicBrainz to user.
});

app.get('/search', async (request, response) => { // http://localhost:3000/search
    let artistName = request.query.q; //http://localhost:3000/search?q={ARTIST SEARCH TERM}
    let artistResult = await api.searchArtist({query: artistName}); // api call to music brainz with the search query

    let artistList = artistResult['artists']; // the list of artists out of the result from the API call

    let result = []; // empty array to store out artist restults
    for(let artist of artistList) { // loop through every artist in the search results
        result.push({
            'name': artist['name'],
            'id': artist['id']
        }); // put the name and id of each artist into an object and put it in the result list
    // console.log(artist['name'] + " has an ID of " + artist['id']);
    }
    // const firstArtist = await api.lookupArtist(artistList[0]['id']);
    response.send(result); // send our built result list, Express automatically converts the javascript object into JSON
});

app.use(express.static("public"));