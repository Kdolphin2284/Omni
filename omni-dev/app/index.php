<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Omni App</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
    <link rel="stylesheet" href="styles.css?version=<?php echo time();?>">
</head>
<body>
    <!-- <header class="navigation"> -->
      <!-- <a href="/">Omni</a> -->
    <!-- </header> -->
    <a href="/">
        <h1 id="OmniLogo">Omni</h1>
    </a>
    <h3>A music discovery app based around the relational similarity between artists.</h3>
    <em>Hover, drag, and click the nodes and links!</em>
    <form>
        <input type="text" id="query" placeholder="Search for an artists to discover similar artists">
        <button id="submit">Draw Graph</button>
    </form>

    <a id="uri"></a>
    <h2 id="message"></h2>
    <svg id="chart"></svg>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="main.js?version=<?php echo time();?>"></script>
</body>
</html>
