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
            <button onclick="modalGone()" id="closeModal" class="btn">
                <img src="images/material-symbols_close.svg" id="closeModalX" class="icon">
            </button>
            <button onclick="openArtistSpotify()" class="btn">
                <span>Open on Spotify</span>
                <img src="images/spotify.svg" class="icon">
            </button>
        </div>
        <div class="artist-basic-info flex-column">
            <img src="#" alt="" class="artist-image" id="modal_artist_image">
            <h4 class="artist-name" id="modal_artist_name">Artist Name</h4>
            <!-- <div class="flex-horizontal-16">
                <button onclick="myFunction()" class="btn">
                    <img src="images/overview.svg" class="icon">
                    <span>Overview</span>
                </button>
                <button onclick="myFunction()" class="btn">
                    <img src="images/user.svg" class="icon">
                    <span>About</span>
                </button>
            </div> -->
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
                <button onclick="getArtistAlbums(lastArtist.uuid)" class="btn">
                    <img src="images/album.svg" class="icon">
                    <span>Albums</span>
                </button>
                <button onclick="getArtistEPs(lastArtist.uuid)" class="btn">
                    <img src="images/music.svg" class="icon">
                    <span>Singles & EPs</span>
                </button>
                <!-- <button onclick="myFunction()" class="btn">
                    <img src="images/playlist.svg" class="icon">
                    <span>Playlists</span>
                </button> -->
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
        <div class="nav-container" id="nav-container-id">
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
                    <h2 class="h2-title">Your top artists</h2>   
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
    <div class="blurBackground">
        <svg id="chart">
        </svg>
    </div>

    <div id="modal">
        <div class="artistWrapper">
            <div class="artistImg">
            </div>
        </div>

        <div id="artistNameButton" class='button' onclick="modalRight()"><img class="icon" src="images/artistInfoIcon.svg" alt="Artist Info Icon" /><span id="selected_artist_modal_name">Name</span></div>
        <div id="extra-kids">
            <div class="modal-flex">
                <div onmouseover="showInfluencesToolTip()" onmouseout="closeInfluencesToolTip()" id="influencesButtonOuterNodes" class='button'><img class="icon" src="images/artistInfluencesIcon.svg" alt="Artist Info Icon"><p>Influences</p></div>
                <div id="influencesToolTip">
                    <p class="toolTipText">Explore the artists who influenced this artist<p/>
                </div>
                <!-- <img src="images/artistArrowLeft.png" alt="Artist Info Icon"> -->
                <div onmouseover="showSimilarToolTip()" onmouseout="closeSimilarToolTip()" id="similarButtonOuterNodes" class='button'><img class="icon" src="images/similarArtistIcon.svg" alt="Artist Info Icon"><p>Similar Artists</p></div>
                <div id="similarToolTip">
                    <p class="toolTipText">Explore the artists who are similar to this artist<p/>
                </div>
                <!-- <img src="images/artistArrowRight.png" alt="Artist Info Icon"> -->
                <div onmouseover="showInfluencedToolTip()" onmouseout="closeInfluencedToolTip()" id="influencedButtonOuterNodes" class='button'><img class="icon" src="images/influencedArtistIcon.svg" alt="Artist Info Icon"><p>Influenced</p></div>
                <div id="influencedToolTip">
                    <p class="toolTipText">Explore the artists who were influenced by this artist<p/>
                </div>
            </div>
        </div>
        <div id="original-artist-extra-kids">
            <div class="modal-flex">
                <div onmouseover="showOriginalInfluencesToolTip()" onmouseout="closeOriginalInfluencesToolTip()" id="originalInfluences" class='button'><img class="icon" src="images/artistInfluencesIcon.svg" alt="Artist Info Icon"></div>
                <div id="originalInfluencesToolTip">
                    <p class="toolTipText">Explore the artists who influenced this artist<p/>
                </div>
                <div onmouseover="showOriginalSimilarToolTip()" onmouseout="closeOriginalSimilarToolTip()" id="originalSimilar" class='button'><img class="icon" src="images/similarArtistIcon.svg" alt="Artist Info Icon"></div>
                <div id="originalSimilarToolTip">
                    <p class="toolTipText">Explore the artists who are similar to this artist<p/>
                </div>
                <div onmouseover="showOriginalInfluencedToolTip()" onmouseout="closeOriginalInfluencedToolTip()" id="originalInfluenced" class='button'><img class="icon" src="images/influencedArtistIcon.svg" alt="Artist Info Icon"></div>
                <div id="originalInfluencedToolTip">
                    <p class="toolTipText">Explore the artists who were influenced by this artist<p/>
                </div>
            </div>
        </div>
    </div> 

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="main.js?version=<?php echo $milliseconds;?>"></script>
    <!-- <script src="ui.js"></script> -->
    <!-- <script> -->
<!--  -->
        <!-- </script> -->
</body>
</html>
