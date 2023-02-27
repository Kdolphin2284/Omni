function smoothLerp(startX, startY, targetX, targetY, percent, animationCurve){
    let x = (startX * (1.0 - animationCurve(percent))) + (targetX * (animationCurve(percent)));
    let y = (startY * (1.0 - animationCurve(percent))) + (targetY * (animationCurve(percent)));
    return [x, y];
}

function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

var updateModalStatic = null;
var showModalStatic = null;
var SELECTED_ARTIST = "";
var animationTick = 0;
var graphMoveTick = 0;
export class Graph {
    constructor(elementName, centerArtist, dependingArtists, showModal, updateModal) {
        this.elementName = elementName;  
        this.generate(centerArtist, dependingArtists);
        this.showModal = showModal;
        showModalStatic = showModal;
        updateModalStatic = updateModal;
        this.updateModal = updateModal;
    }
    currentGraphPosition = [0,0];
    targetGraphCenter = [0,0];
    startGraphPosition = [0,0];
    startPosition = [];
    maxAnimationTime = 20.0;
    simulation = 0;
    chartWidth = 0;
    chartHeight = 0;
    defaultMiddleX = 0;
    defaultMiddleY = 0;
    EXPANDED_NODE_SIZE = 102.5;

    generate(centerArtist, dependingArtists) {
        let firstGraph = this.buildFirstGraph(centerArtist, dependingArtists);
        this.graph = firstGraph;
        this.drawGraph(this.graph);
    }

    update(centerArtist, dependingArtists) {
        this.graph = this.buildGraph(centerArtist, dependingArtists);
        this.drawGraph(this.graph);
    }



    buildGraph(originalArtist, artists) {

        const _reduceArtist = (artist, original) => {
            return {
                id: artist.name,
                uri: artist.uri,
                image: artist.images[0].url,
                uuid: artist.id,
                original: original,
                rad: original ? this.EXPANDED_NODE_SIZE : 62.5
            };
        };

        const addToGraph = (graphObj, artist, nodeObj, linkObj) => {
            nodeObj.id = artist.name;
            linkObj.target = artist.name;
            graphObj.nodes.push(nodeObj);
            graphObj.links.push(linkObj);
            return graphObj;
        }

        console.log(originalArtist);
        console.log(artists);
       let result = this.graph || {
            nodes: [_reduceArtist(originalArtist, true)],
            links: []
        };

        for(var artist of artists){
            var nodeObj = _reduceArtist(artist, false);
            var linkObj = {source: originalArtist.name};
            result = addToGraph(result, artist, nodeObj, linkObj);
        }

        this.graph = result;
        return result;
    }

    buildFirstGraph(originalArtist, firstDegreeArtists) {
        return this.buildGraph(originalArtist, firstDegreeArtists);
    }
    
    moveGraphToCenter(x, y){
        this.simulation.force("center", d3.forceCenter(x, y));
        this.currentGraphPosition = [x, y];
    }
    
    setupGraph(x, y){
        this.aphCenter = [x, y];
        this.currentGraphPosition = [x, y];
        this.startGraphPosition = [x, y];

        this.moveGraphToCenter(x, y);
    }
    

    centerGraph() {
        this.animateGraphToCenter(this.defaultMiddleX, this.defaultMiddleY);

    }

    offcenterGraph() {
        this.animateGraphToCenter(this.chartWidth * 7.8 / 10, this.defaultMiddleY / 1.4);
    }
    

    animateGraphToCenter(x, y) {
        console.log("!! X" + x +", " + y);
        this.startGraphPosition = [this.currentGraphPosition[0], this.currentGraphPosition[1]];
        this.targetGraphCenter = [x, y];
        console.log(this.targetGraphCenter);
        graphMoveTick = 0;
    }
    

    generatePatterns(graph, svg) {
        var pattern = svg.append('svg:defs');

        for(let artist of graph.nodes) {
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

        return pattern;
    }

    getSizeOfNode(node) {
        if(node.original || node.id == SELECTED_ARTIST){
            return this.EXPANDED_NODE_SIZE;
        }
        return node.rad;
    }


    getNode(graph, svg){
        let div = this.div;
        let EXPANDED_NODE_SIZE = this.EXPANDED_NODE_SIZE;

        let simulation = this.simulation;
        const setStartPosition = (a) => {
            this.startPosition = a;
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
        
        const getSizeOfNode = (node) => {
            if(node.original || node.id == SELECTED_ARTIST){
                return this.EXPANDED_NODE_SIZE;
            }
            return node.rad;
        };

        console.log(this.showModal);
        var showModal = this.showModal;

        var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", function (d) {return getSizeOfNode(d);})
        .style("fill", function(d) {return "url(#" + d.uuid + ")"})
        .on("mouseover", function(node) {
            node.hovered = true;
            d3.select(this).transition().duration(200)
            .attr("r", function (d) {return EXPANDED_NODE_SIZE;})
            div.transition()
                .duration(200)
                .style("opacity", .9)
            div.html(node.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d){
            d3.select(this).transition().duration(200)
            .attr("r", function (d) {
                if(SELECTED_ARTIST == d.id){
                    return EXPANDED_NODE_SIZE;
                }
                return d.rad;
            })
            .on("end", function(der){
                node.hovered = false;
            });
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(d) {
            showModalStatic(d, d.x, d.y);
            SELECTED_ARTIST = (d.id);
            animationTick = (0);
            setStartPosition([d.x, d.y]);
        })
        .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
        return node;
    }



    drawGraph(graph){
        graph.nodes = _.uniqBy(graph.nodes, "id");
        let svg = d3.select("svg"),
            width = parseInt(d3.select(`#${this.elementName}`).style("width")),
            height = parseInt(d3.select(`#${this.elementName}`).style("height"));
        this.chartWidth = width;
        this.chartHeight = height;
        this.defaultMiddleX = width / 2;
        this.defaultMiddleY = height / 2 - 20;

        let defaultMiddleX = this.defaultMiddleX;
        let defaultMiddleY = this.defaultMiddleY;
        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {return 0.5;}))
            .force("charge", d3.forceManyBody().strength(-20000))
            .force("center", d3.forceCenter(defaultMiddleX, defaultMiddleY));

        if(this.defaultMiddleX !== 0){
            // this.setupGraph(defaultMiddleX, defaultMiddleY);
        }

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0); 
    
    
        let link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", 2)
        .on("mouseover", () => this.linkHover()())
        .on("mouseout", () => this.linkLeave()());

        let pattern = this.generatePatterns(graph, svg);
        let node = this.getNode(graph, svg);

        this.simulation.nodes(graph.nodes).on("tick", this.ticked(width, height, node, link));
        this.simulation.force("link").links(graph.links);
       
    }

    ticked(width, height, node, link) {
        animationTick++;
        graphMoveTick++;
        if(graphMoveTick > maxAnimationTime){
            graphMoveTick = maxAnimationTime;
        }
        if(animationTick > maxAnimationTime){
            animationTick = maxAnimationTime;
        }
        if(this.currentGraphPosition[0] != this.targetGraphCenter[0] ||this.currentGraphPosition[1] != this.targetGraphCenter[1]){
            let percent = graphMoveTick / maxAnimationTime;
            let result = smoothLerp(this.startGraphPosition[0], this.startGraphPosition[1], this.targetGraphCenter[0], this.targetGraphCenter[1], percent, easeInOutQuad);
            this.moveGraphToCenter(result[0], result[1]);
        }
        var startPosition = this.startPosition;
        var maxAnimationTime = this.maxAnimationTime;
        var EXPANDED_NODE_SIZE = this.EXPANDED_NODE_SIZE;

        function data() {
        
            let nX = -1;
            let nY = -1;
            let SELECTED_NODE_ANCHOR_X = width / 2;
            let SELECTED_NODE_ANCHOR_Y = height / 2.06;
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
                    if(d.original || d.id == SELECTED_ARTIST){
                        return EXPANDED_NODE_SIZE;
                    }
                    return d.rad;
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
                updateModalStatic(artistJawn, nX, nY); //todo move
        }
        return data;
    }

    

    linkHover() {
        let div = this.div;
        return (d) => {
            div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(d.source.id + " ---> " + d.target.id)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }
    }

    linkLeave() {
        let div = this.div;
        return (d) => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        }
    }
}