import {Graph} from './graph.js';
  
let MY_AUTH_TOKEN = "";
let SELECTED_NODE;
function stringGen(len) {
    var text = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
  }
/**
 * Artist Name Modal: #modal_artist_name
 * Artist Image Modal: #modal_artist_image
 * Song List Modal: #song_list_modal_parent
 * Album Container: #album_container
 */

let MY_ID = "";
let graphObject = null;
window.onload = pageLoad;

/**
 * Artist Schema:
 *  - External URLs:
 *      - "spotify" // url
 *  - Followers:
 *      - href: Str
 *      - total: num
 *  - genres:[String]
 *  - href = artist link
 *  - id = artist id
 *  - images: [{url, width, height}]
 * - name,
 * - popularity
 * - type
 * - uri
 */

function openArtistSpotify() {
    window.open(SELECTED_NODE['uri'], '_blank');
}


function getArtist(query) {
    return $.ajax({
        url: "https://api.spotify.com/v1/search",
        data: {
            q: query,
            type: "artist"
        }
    });
}

function loadArtistTopTracks(artistId) {
    return $.ajax({
        url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`
    });
}

function getArtistTopTracks(artistId) {
    return $.when(loadArtistTopTracks(artistId)).then(function( data, textStatus, jqXHR ) {
        // alert( jqXHR.status ); // Alerts 200
        updateModalWithTrackData(data);
        console.log(data);
        // console.log(JSON.stringify(data));
      });
}

function loadArtistAlbums(artistId) {
    return $.ajax({
        url: `https://api.spotify.com/v1/artists/${artistId}/albums?market=ES&include_groups=album`
    });
}

function getArtistAlbums(artistId) {
    return $.when(loadArtistAlbums(artistId)).then(function(data, textStatus, jqXHR) {
        console.log(data);
        updateModalWithAlbumData(data);
    });
}

function buildAlbumHTML(element) {
    let html = `
    <div class="album flex-column">
        <img src="${element['images'][0]['url']}" alt="" class="album-cover-lg">
        <p class="album-name">${element['name'].substring(0,33)}</p>
        <p class="album-year">${element['release_date'].substring(0,4)}</p>
    </div>`;
    return html;
}

function updateModalWithAlbumData(data) {
    let albums = data['items'];
    let albumHtmls = [];
    for(const element of albums) {
        albumHtmls.push(buildAlbumHTML(element));
    }
    let albumList = albumHtmls.join("\n");
    $("#album-container").html(albumList);
}

function updateModalWithTrackData(data) {
    //ahahahahahahahahahahahahahah
    let tracks = data['tracks'];
    let songHtmls = [];
    let count = 0;
    for(const element of tracks) {
        songHtmls.push(buildSongEntry(element));
        if(count++ == 4) break;
    }
    let songList = songHtmls.join("\n");
    $("#song_list_modal_parent").html(songList);

}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

function buildSongEntry(element) {
    let htmlFiller = `<div class="artist-song flex-between">
    <div>
        <img src="${element['album']['images'][0]['url']}" alt="${element['album']['name']}" class="album-cover-sm">
        <div class="song-name">
            <p>${element['name']}</p>
            <p class="explicit">${element['explicit'] === true ? " (E)" : ""}</p>
        </div>
    </div>
    <div>
        
        <p>${millisToMinutesAndSeconds(element['duration_ms'])}</p>
    </div>
</div>`;
    return htmlFiller;
}



function getRelatedArtists(artistId) {
    return $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists"
    });
}

function getFirstDegreeArtists(artist) {
    let maxArtists = 8;
    $("#uri").attr("href", artist.uri).text(artist.name);
    return $.when(getRelatedArtists(artist.id)
        .then(function(response) { 
            if(response.artists.length > maxArtists){
                response.artists = response.artists.slice(0,maxArtists);
            }
            console.log(response.artists);
            return response.artists; 
        }));
}



function showModal(artist, x, y) {
    if(artist.original){
        graphObject.centerGraph();
    }
    else{
        graphObject.offcenterGraph();
    }
    // modalRight();
    getArtistTopTracks(artist.uuid);
    getArtistAlbums(artist.uuid);
    $("#selected_artist_modal_name").html(artist.id);
    $("#modal_artist_name").html(artist.id);
    $("#modal_artist_image").attr("src", artist.image);
    SELECTED_NODE = artist;
    // $("#modal").html(JSON.stringify(artist));
    $("#modal").css("top", y);
    $("#modal").css("left", x);
    $("#modal").css("display", "block");
}

function updateModal(artist, x, y) {
    if(artist == null){
        $("#modal").css("display", "none");
        return;
    }
    $("#modal").css("display", "block");
    if(artist.original){
        $("#extra-kids").css("display", "none");
        $("#original-artist-extra-kids").css("display", "block");
    }
    else{
        $("#extra-kids").css("display", "block");
        $("#original-artist-extra-kids").css("display", "none");
        //x = is the middle
        //x - (EXPANDED_NODE_SIZE / 2) - (1.5)
    }
    let leftX = ((x - 1.5)) - ($("#modal").width() / 2);
    console.log($("#modal").width());
    $("#modal").css("top", y + (graphObject.EXPANDED_NODE_SIZE * 1.078));
    $("#modal").css("left", leftX);
}



export function visuify(){
    $("svg").empty();
    $("#message").empty();
    $("#uri").empty();
    
    getArtist($("#query").val())
        .then((results) => {
            if(!results.artists.items.length){
                $("#message").text("¯\\_(ツ)_/¯ Can't find that artist - try again.");
                return null;
            }
            let artist = results['artists']['items'][0];
            return getFirstDegreeArtists(artist).then((result) => {
                return [artist, result];
            });
        })
        .then((result) => {
            let graph = new Graph("chart", result[0], result[1], showModal, updateModal);
            graphObject = graph;
        });
    
    }

    $("#submit").on("click", function(e) {
        e.preventDefault();
       visuify();
// O    mniLogoPlacement();
       searchTriggersNone();
   });

  function pageLoad(w) {

    var urlParameters = new URLSearchParams(window.location.search);
    MY_ID = urlParameters.get("state");
    if(MY_ID === null || MY_ID === undefined) {
        MY_ID = (stringGen(16));       
        console.log("COULD NOT FIND STATE.");
        }

    $.get("https://api.omnimusic.co/login", {id: MY_ID},function(data) {
        if(data.toString().startsWith("http")) {
            console.log("REDIRECT TO " + data);
            location.href = data;
        }
        else{
            MY_AUTH_TOKEN = data;
            $.ajaxSetup({
                beforeSend: function (xhr)
                {
                   xhr.setRequestHeader("Authorization","Bearer " + MY_AUTH_TOKEN);        
                }
            });
        }
    });
  }



