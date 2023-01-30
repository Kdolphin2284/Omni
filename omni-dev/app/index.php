<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$milliseconds = intval(microtime(true) * 1000);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Omni App</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
    <link rel="stylesheet" href="styles.css?version=<?php echo $milliseconds;?>">
</head>
<body>
    <!-- <header class="navigation"> -->
      <!-- <a href="/">Omni</a> -->
    <!-- </header> -->
    <a href="/" id="home-element-1">
        <h1 id="OmniLogo">Omni</h1>
    </a>
    <form id="home-element-2">
        <input type="text" id="query" placeholder="Search for an artist to discover similar artists">
        <button id="submit">Draw Graph</button>
    </form>

    <a id="uri"></a>
    <h2 id="message"></h2>
    <svg id="chart"></svg>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="main.js?version=<?php echo $milliseconds;?>"></script>
</body>
</html>
