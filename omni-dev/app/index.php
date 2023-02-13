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
    <!-- <a href="/" id="home-element-1">
        <h1 id="OmniLogo">Omni</h1>
    </a> -->

    <!-- THIS IS WHERE IT STARTS -->
    <a href="https://omnimusic.co/omni-dev/app/" id="homepageLink"></a>
    <div class="container-artist-popup flex-column">
        <div class="flex-between">
            <button onclick="modalGone()" class="btn">
                <img src="images/material-symbols_close.svg" class="icon">
            </button>
            <button onclick="openArtistSpotify()" class="btn">
                <span>Open on Spotify</span>
                <img src="images/spotify.svg" class="icon">
            </button>
        </div>
        <div class="artist-basic-info flex-column">
            <img src="#" alt="" class="artist-image" id="modal_artist_image">
            <h4 class="artist-name" id="modal_artist_name">Artist Name</h4>
            <div class="flex-horizontal-16">
                <button onclick="myFunction()" class="btn">
                    <img src="images/overview.svg" class="icon">
                    <span>Overview</span>
                </button>
                <button onclick="myFunction()" class="btn">
                    <img src="images/user.svg" class="icon">
                    <span>About</span>
                </button>
            </div>
        </div>
        <div class="artist-popular-songs container-secondary flex-column">
            <h2 class="h2-title">Popular Songs</h2>
            <div class="container-artists-songs flex-column" id="song_list_modal_parent">
                <div class="artist-song flex-between">
                    <div>
                        <img src="#" alt="" class="album-cover-sm">
                        <div class="song-name flex-column">
                            <p>Song name</p>
                            <img src="#" alt="">
                        </div>
                    </div>
                    <div>
                        <p>1,000,000,000</p>
                        <p>3:33</p>
                    </div>
                </div>
                <div class="artist-song flex-between">
                    <div>
                        <img src="#" alt="" class="album-cover-sm">
                        <div class="song-name">
                            <p>Song name</p>
                            <img src="#" alt="">
                        </div>
                    </div>
                    <div>
                        <p>1,000,000,000</p>
                        <p>3:33</p>
                    </div>
                </div>
                <div class="artist-song flex-between">
                    <div>
                        <img src="#" alt="" class="album-cover-sm">
                        <div class="song-name">
                            <p>Song name</p>
                            <img src="#" alt="">
                        </div>
                    </div>
                    <div>
                        <p>1,000,000,000</p>
                        <p>3:33</p>
                    </div>
                </div>
                <div class="artist-song flex-between">
                    <div>
                        <img src="#" alt="" class="album-cover-sm">
                        <div class="song-name">
                            <p>Song name</p>
                            <img src="#" alt="">
                        </div>
                    </div>
                    <div>
                        <p>1,000,000,000</p>
                        <p>3:33</p>
                    </div>
                </div>
                <div class="artist-song flex-between">
                    <div>
                        <img src="#" alt="" class="album-cover-sm">
                        <div class="song-name">
                            <p>Song name</p>
                            <img src="#" alt="">
                        </div>
                    </div>
                    <div>
                        <p>1,000,000,000</p>
                        <p>3:33</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-secondary flex-column">
            <h2 class="h2-title">Discography</h2>
            <div class="flex-horizontal-16">
                <button onclick="myFunction()" class="btn">
                    <img src="images/album.svg" class="icon">
                    <span>Albums</span>
                </button>
                <button onclick="myFunction()" class="btn">
                    <img src="images/music.svg" class="icon">
                    <span>Singles & EPs</span>
                </button>
                <button onclick="myFunction()" class="btn">
                    <img src="images/playlist.svg" class="icon">
                    <span>Playlists</span>
                </button>
            </div>
            <div id="album-container" class="container-albums">
                <div class="album flex-column">
                    <img src="#" alt="" class="album-cover-lg">
                    <p class="album-name">Album Name</p>
                    <p class="album-year">2017</p>
                </div>
                <div class="album flex-column">
                    <img src="#" alt="" class="album-cover-lg">
                    <p class="album-name">Album Name</p>
                    <p class="album-year">2017</p>
                </div>
                <div class="album flex-column">
                    <img src="#" alt="" class="album-cover-lg">
                    <p class="album-name">Album Name</p>
                    <p class="album-year">2017</p>
                </div>
                <div class="album flex-column">
                    <img src="#" alt="" class="album-cover-lg">
                    <p class="album-name">Album Name</p>
                    <p class="album-year">2017</p>
                </div>
                <div class="album flex-column">
                    <img src="#" alt="" class="album-cover-lg">
                    <p class="album-name">Album Name</p>
                    <p class="album-year">2017</p>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="nav-container">
        <!-- <img src="images/logo-lg.svg" alt="logo"> -->
            <div class="nav-content">
                <div class="user-button">
                    
                    <div class="dropdown">
                        <button onclick="myFunction()" class="btn dropbtn">
                            <img class="icon" src="images/spotify.svg">
                            <span>aidanty23</span>
                            <img class="icon" src="images/down-med.svg">
                        </button>
                        <!-- <div id="myDropdown" class="dropdown-content">
                            <a href="#">Link 1</a>
                        </div> -->
                    </div>
                </div>
                <button onclick="myFunction()" class="btn dropbtn">
                    <img class="icon" src="images/help.svg" alt="">
                </button>
            </div>
        </div>
        <div class="content-main flex-column" id="search-triggers-none">
            <div class="container-secondary flex-column">
                <div class="logo" id="logo">
                    <!-- <h1 class="h1-title">Omni</h1> -->
                    <img src="images/logo-lg.svg" alt="logo" id="logo-img">
                </div>
                <form id="home-element-2">
                    <img src="images/dark-search-md.svg" alt="search">
                    <input type="text" id="query" placeholder="Search for an artist to discover similar artists">
                    <button id="submit">Draw Graph</button>
                </form>
            </div>
            <div class="container-secondary flex-column" id="recently-played">
                <h2 class="h2-title">Recently played</h2>
                <div class="artist-grid">
                    <button class="btn">
                        <img src="#" alt="" class="img-placeholder-sm">
                        <p class="artistButtonText">The Weeknd</p>
                    </button>
                </div>
            </div>
            <div class="container-secondary flex-column" id="top-artists">
                <div>
                    <h2 class="h2-title">Top artists</h2>   
                    <div class="dropdown">
                        <button onclick="myFunction()" class="btn dropbtn">
                            <span>Last 30 Days</span>
                            <img class="icon" src="images/down-med.svg">
                        </button>
                        <!-- <div id="myDropdown" class="dropdown-content">
                            <a href="#">Link 1</a>
                        </div> -->
                    </div>
                </div>
                <div class="container-top-artists">
                    <button class="btn-artist flex-column">
                        <img src="#" alt="" class="img-placeholder-lg">
                        <p class="artistButtonText">Nas</p>
                    </button>
                    <button class="btn-artist flex-column">
                        <img src="#" alt="" class="img-placeholder-lg">
                        <p class="artistButtonText">Nas</p>
                    </button>
                    <button class="btn-artist flex-column">
                        <img src="#" alt="" class="img-placeholder-lg">
                        <p class="artistButtonText">Nas</p>
                    </button>
                    <button class="btn-artist flex-column">
                        <img src="#" alt="" class="img-placeholder-lg">
                        <p class="artistButtonText">Nas</p>
                    </button>
                    <button class="btn-artist flex-column">
                        <img src="#" alt="" class="img-placeholder-lg">
                        <p class="artistButtonText">Nas</p>
                    </button>
                </div>
            </div>
        </div>

    </div>

    <!-- THIS IS WHERE IT ENDS -->
    <!-- <form id="home-element-2">
        <input type="text" id="query" placeholder="Search for an artist to discover similar artists">
        <button id="submit">Draw Graph</button>
    </form> -->

    <!-- <a id="uri"></a> -->
    <h2 id="message"></h2>
    <svg id="chart"></svg>
    <div id="modal">
        <div class='button' onclick="modalRight()"><img src="images/artistInfoIcon.png" alt="Artist Info Icon" /><span id="selected_artist_modal_name">Name</span></div>
        <div id="extra-kids">
            <div class="modal-flex">
                <div class='button'><img src="images/artistInfluencesIcon.png" alt="Artist Info Icon">Influences</div>
                <img src="images/artistArrowLeft.png" alt="Artist Info Icon">
                <div class='button'><img src="images/similarArtistIcon.png" alt="Artist Info Icon">Similar Artists</div>
                <img src="images/artistArrowRight.png" alt="Artist Info Icon">
                <div class='button'><img src="images/influencedArtistIcon.png" alt="Artist Info Icon">Influenced</div>
            </div>
        </div>
        <div id="original-artist-extra-kids">
            <div class="modal-flex">
                <div class='button'><img src="images/artistInfluencesIcon.png" alt="Artist Info Icon"></div>
                <div class='button'><img src="images/similarArtistIcon.png" alt="Artist Info Icon"></div>
                <div class='button'><img src="images/influencedArtistIcon.png" alt="Artist Info Icon"></div>
            </div>
        </div>
    </div> 

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="main.js?version=<?php echo $milliseconds;?>"></script>
</body>
</html>
