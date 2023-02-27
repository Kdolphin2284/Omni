
function showInfluencedToolTip() {
    influencedToolTip.style.display = 'block';
}
function closeInfluencedToolTip() {
    influencedToolTip.style.display = 'none';
}

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




let navContainer = document.getElementById('nav-container-id');

function modalRight() {
    $(".container-artist-popup").addClass("container-artist-selected");
}

function modalGone() {
    $(".container-artist-popup").removeClass("container-artist-selected");
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