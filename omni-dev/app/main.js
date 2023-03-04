function stringGen(len) {
    var text = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
  }
  
let MY_AUTH_TOKEN = "";
let SELECTED_ARTIST = "";
let SELECTED_NODE;
let maxArtists = 8;


/**
 * Artist Name Modal: #modal_artist_name
 * Artist Image Modal: #modal_artist_image
 * Song List Modal: #song_list_modal_parent
 * Album Container: #album_container
 */

let MY_ID = "";
window.onload = function (w) {
    
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
};

function spotifyRequest(endpoint, parameters = {}) {
    const url = `https://api.spotify.com/v1/${endpoint}?${$.param(parameters)}`;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        success: function (data) {
          resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          reject(errorThrown);
        },
      });
    });
  }


function getRelatedArtistsPromise(artistId) {
    return spotifyRequest(`artists/${artistId}/related-artists`).then((data) => data['artists']);
}

function getArtistPromise(artistId) {
    return spotifyRequest(`artists/${artistId}`)
}


function getOldestAlbumPromise(artist, limit = 50) {
    function handleAlbumsSuccess(data) {
      if (data.items.length > 0) return data.items[data.items.length - 1];
      else throw new Error("No albums found");
    }
  
    let parameters = {
      limit: limit,
    };
  
    return spotifyRequest(`artists/${artist.id}/albums`, parameters).then((data) => {
      artist.albums = data.items;
      if (data.total <= limit) return handleAlbumsSuccess(data)
      return spotifyRequest(`artists/${artist.id}/albums`, {...parameters, offset: data.total - limit}).then(handleAlbumsSuccess);
    });
  }

  const defaultArtistDataFormatting = (artist) => ({
    external_urls: artist.external_urls,
    followers: artist.followers.total,
    genres: artist.genres,
    href: artist.href,
    images: artist.images,
    name: artist.name,
    oldestAlbum: artist.oldestAlbum,
    popularity: artist.popularity,
    uri: artist.uri,
    albums: artist.albums,
    id: artist.id
  });
  
  function getRelationalData(artistId, reformatArtistData = defaultArtistDataFormatting) {
    let oldestAlbum;
    let relatedArtists;
    let influences = [];
    let influenced = [];
  
    const parseReleaseDate = (releaseDate) => new Date(releaseDate)
    const reformatList = (list) => list.map(reformatArtistData)
    const handlePromiseComplete = () => ({influences: reformatList(influences), influenced: reformatList(influenced)})
    const handleRelatedAlbumsSuccess = (albums) => Promise.all(albums.map((album, index) => getOldestAlbumPromise(relatedArtists[index]).catch(() => null)))
    const handleRelatedArtistsSuccess = (data) => relatedArtists = data
  
    // if both artists have no albums, we will be considered the influencer OF the relatedArtist. (We influenced the related artist.)
    // This is a arbitrary choice, we could reasonably add another response field of "neither" to house cases like this
    function handleOldestRelatedAlbumSuccess(data, relatedArtist) {
      relatedArtist.oldestAlbum = data;
      influenced.push(relatedArtist);
      if (data !== null && (oldestAlbum === null || parseReleaseDate(data['release_date']) < parseReleaseDate(oldestAlbum['release_date']))) // wow this is awful(ly good)
        influences.push(influenced.pop())
    }
    function handleOldestAlbumSuccess (data) {
      oldestAlbum = data;
      return getRelatedArtistsPromise(artistId);
    }
    function handleOldestRelatedAlbumsSuccess(albums) {
      albums.forEach((album, index) => handleOldestRelatedAlbumSuccess(album, relatedArtists[index])) // parse data into influenced or influences
      return handlePromiseComplete();
    }
  
    return getOldestAlbumPromise({id: artistId}).catch(() => null)
      .then(handleOldestAlbumSuccess)
      .then(handleRelatedArtistsSuccess)
      .then(handleRelatedAlbumsSuccess)
      .then(handleOldestRelatedAlbumsSuccess)
      .catch((e) => {throw e});
  }

function getInfluences(artist) {
    $("#uri").attr("href", artist.uri).text(artist.name);
    let artistId = artist.id;
    return getRelationalData(artistId).then((data) => {
        if(data.influences.length > maxArtists) {
            return data.influences.slice(0, maxArtists);
        }
        return data.influences;
    })
}
function getInfluenced(artist) {
    $("#uri").attr("href", artist.uri).text(artist.name);
    let artistId = artist.id;
    return getRelationalData(artistId).then((data) => {
            if(data.influenced.length > maxArtists) {
                return data.influenced.slice(0, maxArtists);
            }
            return data.influenced;
    })
}


function addToGraph(graphObj, artist, nodeObj, linkObj) {
    nodeObj.id = artist.name;
    linkObj.target = artist.name;
    graphObj.nodes.push(nodeObj);
    graphObj.links.push(linkObj);

    return graphObj;
}

let EXPANDED_NODE_SIZE = 102.5;

function openArtistSpotify() {
    window.open(SELECTED_NODE['uri'], '_blank');
}

function buildGraph(originalArtist, artists, existingGraph) {
    let artist = {id: originalArtist.name, uri: originalArtist.uri, image: originalArtist.images[0].url, uuid: originalArtist.id, original: true, rad: EXPANDED_NODE_SIZE};
    var graphObj = existingGraph || {
        nodes: [artist],
        links: []
    };
    SELECTED_ARTIST = originalArtist.name;
    $(".artistImg").css("background-image", "url(\"" + artist.image + "\")");
    lastArtist = artist;
    getArtistTopTracks(artist.uuid);
    getArtistAlbums(artist.uuid);
    $("#selected_artist_modal_name").html(artist.id);
    $("#modal_artist_name").html(artist.id);
    $("#modal_artist_image").attr("src", artist.image);
    SELECTED_NODE = artist;
    //showModal(, d.x, d.y);
    graphObj = artists.reduce(function(accum, artist) {
        // var nodeObj = {id: artist.name, uri: artist.uri, image: artist.images[0].url, uuid: artist.id, original: false, rad: EXPANDED_NODE_SIZE / 2};
        var nodeObj = {id: artist.name, uri: artist.uri, image: artist.images[0].url, uuid: artist.id, original: false, rad: 62.5};
        var linkObj = {source: originalArtist.name};
        return addToGraph(graphObj, artist, nodeObj, linkObj);
    }, graphObj);

    return graphObj;
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

function loadArtistAlbums(artistId, group="album") {
    return $.ajax({
        url: `https://api.spotify.com/v1/artists/${artistId}/albums?market=ES&include_groups=${group}`
    });
}

function getArtistAlbums(artistId) {
    return $.when(loadArtistAlbums(artistId)).then(function(data, textStatus, jqXHR) {
        console.log(data);
        updateModalWithAlbumData(data);
    });
}

function getArtistEPs(artistId) {
    return $.when(loadArtistAlbums(artistId, "single")).then(function(data, textStatus, jqXHR) {
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
            ${element['explicit'] === true ? "<img class='explicit' src='images/explicit.svg' alt='(E)'> " : ""}
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

function getFirstDegreeArtists(response) {
    if (!response.artists.items.length){
        $("#message").text("¯\\_(ツ)_/¯ Can't find that artist - try again.");
    }
    var artist = response.artists.items[0];
    $("#uri").attr("href", artist.uri).text(artist.name);
    return $.when(artist, getRelatedArtists(artist.id)
        .then(function(response) { 
            if(response.artists.length > maxArtists){
                response.artists = response.artists.slice(0,maxArtists);
            }
            console.log(response.artists);
            return response.artists; 
        }));
}

// function getSecondDegreeArtists(firstDegreeGraph, firstDegreeArtists) {
//     var deferreds = [$.when(firstDegreeGraph)];
//     firstDegreeArtists.forEach(function(firstDegreeArtist) {
//         var artistDeferred = $.Deferred();
//         deferreds.push(artistDeferred);

//         getRelatedArtists(firstDegreeArtist.id)
//             .then(function(response) {
//                 var firstDegreeArtistItem = {};
//                 firstDegreeArtistItem[firstDegreeArtist.name] = response.artists;
//                 artistDeferred.resolve(firstDegreeArtistItem);
//             })
//     });

//     return $.when.apply(null, deferreds);
// }

function visuifyInfluenced(){
    let artistId = SELECTED_NODE['uuid'];
    $("svg").empty();
    $("#message").empty();
    $("#uri").empty();

    getArtistPromise(artistId).then(artist => {
        return getInfluenced(artist)
        .then(influenced => buildGraph(artist, influenced));
    }).then(drawGraph);
    $("#originalInfluences").removeClass("active");
    $("#originalSimilar").removeClass("active");
    $("#originalInfluenced").addClass("active");
}

function visuifyInfluences(){
    let artistId = SELECTED_NODE['uuid'];
    $("svg").empty();
    $("#message").empty();
    $("#uri").empty();

    getArtistPromise(artistId).then(artist => {
        return getInfluences(artist)
        .then(influences => buildGraph(artist, influences));
    }).then(drawGraph);
    $("#originalInfluences").addClass("active");
    $("#originalSimilar").removeClass("active");
    $("#originalInfluenced").removeClass("active");
}

function visuifySimilar() {
    let artistId = SELECTED_NODE['uuid'];
    $("svg").empty();
    $("#message").empty();
    $("#uri").empty();
    let maxArtists = 8;

    getArtistPromise(artistId).then(artist => {
        return getRelatedArtistsPromise(artistId)
        .then(related => {
            if(related.length > maxArtists){
                return buildGraph(artist, related.splice(0, maxArtists))
            }
            return buildGraph(artist, related)
        });
    }).then(drawGraph);
    $("#originalInfluences").removeClass("active");
    $("#originalSimilar").addClass("active");
    $("#originalInfluenced").removeClass("active");
}


function buildFirstGraph(originalArtist, firstDegreeArtists) {
    return $.when(buildGraph(originalArtist, firstDegreeArtists), firstDegreeArtists);
}

// function buildUpdatedGraph(firstDegreeGraph) {
//     var updatedGraph = firstDegreeGraph;
//     var firstDegreeArtistsMap = Array.prototype.slice.call(arguments, 1);

//     firstDegreeArtistsMap.forEach(function(secondDegreeArtists, i) {
//         updatedGraph = buildGraph(
//             { name: Object.keys(secondDegreeArtists)[0] },
//             secondDegreeArtists[Object.keys(secondDegreeArtists)[0]],
//             firstDegreeGraph
//         );
//     });

//     return updatedGraph;
// }

function moveGraphToCenter(x, y){
    simulation.force("center", d3.forceCenter(x, y));
    currentGraphPosition = [x, y];
}

function setupGraph(x, y){
    targetGraphCenter = [x, y];
    currentGraphPosition = [x, y];
    startGraphPosition = [x, y];
    moveGraphToCenter(x, y);
}

function animateGraphToCenter(x, y) {
    startGraphPosition = [currentGraphPosition[0], currentGraphPosition[1]];
    targetGraphCenter = [x, y];
    graphMoveTick = 0;
}

var currentGraphPosition = [0,0];
var targetGraphCenter = [0,0];
var startGraphPosition = [0,0];
var lastArtist = null;

function showModal(artist, x, y) {
    lastArtist = artist;
    if(artist.original){
        animateGraphToCenter(defaultMiddleX, defaultMiddleY);
    }
    else{
        animateGraphToCenter(chartWidth * 7.8 / 10, defaultMiddleY / 1.4);
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
    $("#modal").css("top", y + (EXPANDED_NODE_SIZE * 1.078));
    $("#modal").css("left", leftX);
}
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function smoothLerp(startX, startY, targetX, targetY, percent, animationCurve){
    let x = (startX * (1.0 - animationCurve(percent))) + (targetX * (animationCurve(percent)));
    let y = (startY * (1.0 - animationCurve(percent))) + (targetY * (animationCurve(percent)));
    return [x, y];
}

let animationTick = 0;
let startPosition = [];
let maxAnimationTime = 20.0;
let graphMoveTick = 0;

function getSizeOfNode(node) {
    if(node.original || node.id == SELECTED_ARTIST){
        return EXPANDED_NODE_SIZE;
    }
    return node.rad;
}


var simulation;
var chartWidth;
var chartHeight;

var defaultMiddleX;
var defaultMiddleY;

function drawGraph(graph){
    graph.nodes = _.uniqBy(graph.nodes, "id");
    var svg = d3.select("svg"),
        width = parseInt(d3.select("#chart").style("width")),
        height = parseInt(d3.select("#chart").style("height"));
    chartWidth = width;
    chartHeight = height;
    defaultMiddleX = width / 2;
    defaultMiddleY = height / 2 - 20;
    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {return 0.5;}))
        // .force("charge", d3.forceManyBody().strength(-100))
        .force("charge", d3.forceManyBody().strength(-20000))
        .force("center", d3.forceCenter(defaultMiddleX, defaultMiddleY));
    setupGraph(defaultMiddleX, defaultMiddleY);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.source.id + " ---> " + d.target.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


    var pattern = svg.append('svg:defs');
    for(let artist of graph.nodes) {
        console.log(artist);
        pattern.append("svg:pattern")
        .attr("id", artist.uuid)
        .attr("width", 1)
        .attr("height", 1)
        .attr("viewBox", "0 0 128 128")
        .attr("preserveAspectRatio", "none")
        .append("svg:image")
        .attr("width", 128)
        .attr("height", 128)
        .attr("xlink:href", artist.image)
        .attr("preserveAspectRatio", "none");
     
    }


        var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", function (d) {return getSizeOfNode(d);})
        .style("fill", function(d) {return "url(#" + d.uuid + ")"})
        .style("z-index", function(d) {return 55})
        .on("mouseover", function(d) {
            d.hovered = true;
            d3.select(this).transition().duration(200)
            .attr("r", function (d) {return EXPANDED_NODE_SIZE;})
            div.transition()
                .duration(200)
                .style("opacity", .9)
            div.html(d.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).transition().duration(200)
            .attr("r", function (d) {
                if(SELECTED_ARTIST == d.id){
                    return EXPANDED_NODE_SIZE;
                }
                return d.rad})
            .on("end", function(der){
                d.hovered = false;
            });
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(d) {
        
            showModal(d, d.x, d.y);
            SELECTED_ARTIST = d.id;
            animationTick = 0;
            startPosition = [d.x, d.y];
            $(".artistImg").css("background-image", "url(\"" + d.image + "\")");
            // visuify();
            // $("#query").val(d.id);
            // div.transition()
            //     .duration(500)
            //     .style("opacity", 0);
            // visuify()
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    

            // node.append("image")
            // .attr("xlink:href", 'http://placekitten.com/g/48/48')
            // .attr("width", 128)
            // .attr("height", 128)
            // .attr("preserveAspectRatio", "none");

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked)


    simulation.force("link")
        .links(graph.links);

    


    
    function ticked() {
        console.log("UPDATED 1");
        animationTick++;
        graphMoveTick++;
        if(graphMoveTick > maxAnimationTime){
            graphMoveTick = maxAnimationTime;
        }
        if(animationTick > maxAnimationTime){
            animationTick = maxAnimationTime;
        }
        if(currentGraphPosition[0] != targetGraphCenter[0] || currentGraphPosition[1] != targetGraphCenter[1]){
            let percent = graphMoveTick / maxAnimationTime;
            let result = smoothLerp(startGraphPosition[0], startGraphPosition[1], targetGraphCenter[0], targetGraphCenter[1], percent, easeInOutQuad);
            moveGraphToCenter(result[0], result[1]);
        }
        
        let nX = -1;
        let nY = -1;
        let SELECTED_NODE_ANCHOR_X = chartWidth / 2;
        // let SELECTED_NODE_ANCHOR_X = 1000;
        // let SELECTED_NODE_ANCHOR_X = 350;
        let SELECTED_NODE_ANCHOR_Y = chartHeight / 2.06;
        // let SELECTED_NODE_ANCHOR_Y = chartHeight / 1.785 - (EXPANDED_NODE_SIZE);
        // let SELECTED_NODE_ANCHOR_Y = chartHeight / 2 - (EXPANDED_NODE_SIZE);
        let artistJawn = null;
        let animationPosition;
        if(SELECTED_ARTIST != null){
            animationPosition = smoothLerp(startPosition[0], startPosition[1], SELECTED_NODE_ANCHOR_X, SELECTED_NODE_ANCHOR_Y, animationTick / maxAnimationTime, easeInOutQuad);
        }
        node
            .attr("cx", function(d) { 
                if(d.id == SELECTED_ARTIST && !d.original){
                    artistJawn = d;
                    nX = animationPosition[0];
                    return animationPosition[0];
                }
                else if(d.id == SELECTED_ARTIST){
                    nX = d.x;
                }
                if(d.id == SELECTED_ARTIST){
                    artistJawn = d;
                }
                return d.x; 
            })
            .attr("cy", function(d) { 
                if(d.id == SELECTED_ARTIST && !d.original) {
                    nY = animationPosition[1];
                    return animationPosition[1];
                }
                else if(d.id == SELECTED_ARTIST){
                    nY = d.y;
                }
                return d.y; 
            })
            .attr("r", function (d) {
                if(d.hovered == true){
                    return d3.select(this).attr("r");
                }
                return getSizeOfNode(d);
            })
            .style("stroke", function(d) {
                if(d.id == SELECTED_ARTIST){
                    return "#FFFFFF";
                }
                else{
                    return "transparent";
                }
            })
            ;
            
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { 
                if(d.target.id == SELECTED_ARTIST){
                    return animationPosition[0];
                }
                return d.target.x; 
            })
            .attr("y2", function(d) { 
                if(d.target.id == SELECTED_ARTIST){
                    return animationPosition[1];
                }
                return d.target.y;
            });

        // let currentArtist = null;
       
            updateModal(artistJawn, nX, nY);
        

            
            // pattern.attr("x", (function(d) { return d.x;}))
                // .attr("y", function(d) {return d.y;})
            // ;
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// Added Code
// const uriCheck = document.getElementById('uri');

// function OmniLogoPlacement() {
//     console.log($("#uri").html().length);
//     if (uriCheck.innerHTML.trim() === '' ) {
//         console.log('empty innerhtml');
//     } else {
//         console.log('full innerhtml: ' + uriCheck);
//     }
// }

const OmniLogo = document.getElementById('OmniLogo');
const uriPadding = document.getElementById('uri');
// const homeElement1 = document.getElementById('home-element-1');

function OmniLogoPlacement() {
    OmniLogo.style.position = "absolute";
    OmniLogo.style.top = "0";
    OmniLogo.style.left = "0";
    OmniLogo.style.padding = "30px 0 0 30px";
    OmniLogo.style.fontSize = "34px";
    uri.style.padding = "10px";
    uri.style.background = "#000";
    // homeElement1.style.top = "0";
    // homeElement1.style.left = "0";
    // homeElement1.style.position = "absolute";
    // homeElement1.style.width = "90px";
    // homeElement1.style.height = "32px";
    // homeElement1.style.padding = "30px 0 0 30px";
    // homeElement2.style.top = "0";
}

const homeContent = document.getElementById('search-triggers-none');
const homeElement2 = document.getElementById('home-element-2');
const homeElement2Input = document.getElementById('query');
const recentlyPlayed = document.getElementById('recently-played');
const topArtists = document.getElementById('top-artists');
const homepageLink = document.getElementById('homepageLink');
const chart = document.getElementById('chart');

const logo = document.getElementById('logo');
const logoImg = document.getElementById('logo-img');

function searchTriggersNone() {
    chart.style.position = 'fixed';
    homepageLink.style.display = 'inline-block';
    homepageLink.style.position = 'absolute';
    homepageLink.style.zIndex = '30000';
    homeElement2.style.position = 'absolute';
    homeElement2.style.zIndex = '30000';
    homeElement2.style.top = '48px';
    homeElement2.style.left = '200px';
    query.style.margin = '0';
    query.style.height = '32px';
    query.style.borderRadius = '100px';
    recentlyPlayed.style.display = 'none';
    topArtists.style.display = 'none';
    logo.style.position = 'absolute';
    logo.style.top = '48px';
    logo.style.left = '48px';
    logo.style.height = '32px';
    logoImg.style.height = 'inherit';
}

// End Added Code

function visuify(){
    $("svg").empty();
    $("#message").empty();
    $("#uri").empty();
    getArtist($("#query").val())
        .then(getFirstDegreeArtists)
        .then(buildFirstGraph)
        // .then(getSecondDegreeArtists)
        // .then(buildUpdatedGraph)
        .then(drawGraph);
}

// function visuifyFromNode(){
//     $("svg").empty();
//     $("#message").empty();
//     $("#uri").empty();
//     getArtist($("#selected_artist_modal_name").val())
//         .then(getFirstDegreeArtists)
//         .then(buildFirstGraph)
//         .then(drawGraph);
// }

$("#submit").on("click", function(e) {
    e.preventDefault();
    visuify();
    // OmniLogoPlacement();
    searchTriggersNone();
    $("#originalInfluences").removeClass("active");
    $("#originalSimilar").addClass("active");
    $("#originalInfluenced").removeClass("active");
});

let navContainer = document.getElementById('nav-container-id');

function modalRight() {
    $(".container-artist-popup").addClass("container-artist-selected");
    $(".blurBackground").css("filter", "blur(2px)");

}

function modalGone() {
    $(".container-artist-popup").removeClass("container-artist-selected");
    $(".blurBackground").css("filter", "blur(0px)");
}
// const $bg = document.querySelector(".background");
// const mouseScale = 0.25;
// $bg.addEventListener("mousemove", e => {
//     const x = e.offsetX / $bg.clientWidth * 100 - 50;
//     const y = e.offsetY / $bg.clientHeight * 100 - 50;
//     $bg.style.setProperty("--mouseX", `${(x * mouseScale).toFixed(3)}%`);
//     $bg.style.setProperty("--mouseY", `${(y * mouseScale).toFixed(3)}%`);
// });
// 263, 264, 110, 89 (second degree artist information commented out starting on these 4 lines)






// Show and hide tool tips on outer artist modals

let influencesButton = document.getElementById('influencesButtonOuterNodes');
let similarButton = document.getElementById('similarButtonOuterNodes');
let influencedButton = document.getElementById('influencedButtonOuterNodes');

let influencesToolTip = document.getElementById('influencesToolTip');
let similarToolTip = document.getElementById('similarToolTip');
let influencedToolTip = document.getElementById('influencedToolTip');

function showInfluencesToolTip() {
    influencesToolTip.style.display = 'block';
}
function closeInfluencesToolTip() {
    influencesToolTip.style.display = 'none';
}


function showSimilarToolTip() {
    similarToolTip.style.display = 'block';
}
function closeSimilarToolTip() {
    similarToolTip.style.display = 'none';
}


function showInfluencedToolTip() {
    influencedToolTip.style.display = 'block';
}
function closeInfluencedToolTip() {
    influencedToolTip.style.display = 'none';
}


// Show and hide tool tips on central artist modal
let originalInfluencesButton = document.getElementById('originalInfluences');
let originalSimilarButton = document.getElementById('originalSimilar');
let originalInfluencedButton = document.getElementById('originalInfluenced');

let originalInfluencesToolTip = document.getElementById('originalInfluencesToolTip');
let originalSimilarToolTip = document.getElementById('originalSimilarToolTip');
let originalInfluencedToolTip = document.getElementById('originalInfluencedToolTip');

function showOriginalInfluencesToolTip() {
    originalInfluencesToolTip.style.display = 'block';
}
function closeOriginalInfluencesToolTip() {
    originalInfluencesToolTip.style.display = 'none';
}


function showOriginalSimilarToolTip() {
    originalSimilarToolTip.style.display = 'block';
}
function closeOriginalSimilarToolTip() {
    originalSimilarToolTip.style.display = 'none';
}


function showOriginalInfluencedToolTip() {
    originalInfluencedToolTip.style.display = 'block';
}
function closeOriginalInfluencedToolTip() {
    originalInfluencedToolTip.style.display = 'none';
}