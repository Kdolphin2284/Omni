function stringGen(len) {
    var text = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
  }
  
let MY_AUTH_TOKEN = "";

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


function addToGraph(graphObj, artist, nodeObj, linkObj) {
    nodeObj.id = artist.name;
    linkObj.target = artist.name;
    graphObj.nodes.push(nodeObj);
    graphObj.links.push(linkObj);

    return graphObj;
}

function buildGraph(originalArtist, artists, existingGraph) {
    var graphObj = existingGraph || {
        nodes: [{id: originalArtist.name, uri: originalArtist.uri}],
        links: []
    };
    graphObj = artists.reduce(function(accum, artist) {
        var nodeObj = {id: artist.name, uri: artist.uri};
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

function getRelatedArtists(artistId) {
    return $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists"
    });
}

function getFirstDegreeArtists(response) {
    if (!response.artists.items.length){
        $("#message").text("??\\_(???)_/?? Can't find that artist - try again.");
    }
    var artist = response.artists.items[0];
    $("#uri").attr("href", artist.uri).text($("#query").val());
    return $.when(artist, getRelatedArtists(artist.id)
        .then(function(response) { return response.artists; }));
}

function getSecondDegreeArtists(firstDegreeGraph, firstDegreeArtists) {
    var deferreds = [$.when(firstDegreeGraph)];
    firstDegreeArtists.forEach(function(firstDegreeArtist) {
        var artistDeferred = $.Deferred();
        deferreds.push(artistDeferred);

        getRelatedArtists(firstDegreeArtist.id)
            .then(function(response) {
                var firstDegreeArtistItem = {};
                firstDegreeArtistItem[firstDegreeArtist.name] = response.artists;
                artistDeferred.resolve(firstDegreeArtistItem);
            })
    });

    return $.when.apply(null, deferreds);
}

function buildFirstGraph(originalArtist, firstDegreeArtists) {
    return $.when(buildGraph(originalArtist, firstDegreeArtists), firstDegreeArtists);
}

function buildUpdatedGraph(firstDegreeGraph) {
    var updatedGraph = firstDegreeGraph;
    var firstDegreeArtistsMap = Array.prototype.slice.call(arguments, 1);

    firstDegreeArtistsMap.forEach(function(secondDegreeArtists, i) {
        updatedGraph = buildGraph(
            { name: Object.keys(secondDegreeArtists)[0] },
            secondDegreeArtists[Object.keys(secondDegreeArtists)[0]],
            firstDegreeGraph
        );
    });

    return updatedGraph;
}
function drawGraph(graph){
    graph.nodes = _.uniqBy(graph.nodes, "id");
    var svg = d3.select("svg"),
        width = parseInt(d3.select("#chart").style("width")),
        height = parseInt(d3.select("#chart").style("height"))

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2.5));

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
            div.html(d.source.id + " --- " + d.target.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 8)
        .attr("fill", "#12121")
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(200).attr("r", 14)
            div.transition()
                .duration(200)
                .style("opacity", .9)
            div.html(d.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).transition().duration(200).attr("r", 8)
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(d) {
            $("#query").val(d.id);
            div.transition()
                .duration(500)
                .style("opacity", 0);
            visuify()
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked)


    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
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

function OmniLogoPlacement() {
    OmniLogo.style.position = "absolute";
    OmniLogo.style.top = "0";
    OmniLogo.style.left = "0";
    OmniLogo.style.padding = "30px 0 0 30px";
    OmniLogo.style.fontSize = "34px";
}


// End Added Code

function visuify(){
    $("svg").empty();
    $("#message").empty();
    $("#uri").empty();
    getArtist($("#query").val())
        .then(getFirstDegreeArtists)
        .then(buildFirstGraph)
        .then(getSecondDegreeArtists)
        .then(buildUpdatedGraph)
        .then(drawGraph);
}

$("#submit").on("click", function(e) {
    e.preventDefault();
    visuify();
    OmniLogoPlacement();
});
