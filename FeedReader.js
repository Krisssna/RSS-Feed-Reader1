// Define multiple API keys for rss2json
let API_KEYS = [
    "API_KEY_1",
    "API_KEY_2",
    "API_KEY_3"
    // Add more API keys if necessary
];

// Function to get the current rss2json API key and rotate it
let apiKeyIndex = 0;
function getRSS2JSONApiKey() {
    const apiKey = API_KEYS[apiKeyIndex % API_KEYS.length];
    apiKeyIndex++;  // Move to the next key for the next request
    return apiKey;
}

// Base API URLs
let RSS2JSON_API = "https://api.rss2json.com/v1/api.json?rss_url=";
let FEED2JSON_API = "https://www.toptal.com/developers/feed2json/convert?url=";

// Define a mapping of RSS feed URLs for each category
const feedURLs = {
    'construction-news': [
        'https://www.google.com/alerts/feeds/06313983183609550648/863422411556577025',
        'https://www.google.com/alerts/feeds/06313983183609550648/16219506770346016876',
        'https://www.google.com/alerts/feeds/06313983183609550648/16120492411931428893',
        'https://www.google.com/alerts/feeds/06313983183609550648/9874521726757945814',
        'https://www.google.com/alerts/feeds/06313983183609550648/13722836873792678019',
        'https://www.google.com/alerts/feeds/06313983183609550648/17566939723916288150',
        'https://www.google.com/alerts/feeds/06313983183609550648/7361213428763324582',
        'https://www.google.com/alerts/feeds/06313983183609550648/8196542214144987233'
    ],
    'share-market': [
        'https://arthasarokar.com/feed',
        'https://arthadabali.com/feed',
        'https://www.arthapath.com/feed',
        'https://bajarkochirfar.com/feed',
        'https://bizmandu.com/feed',
        'https://www.corporatenepal.com/rss',
        'https://www.nepsebajar.com/feed'
    ],
    'nepali-news': [
        'https://annapurnapost.com/rss',
        'https://www.bbc.com/nepali/index.xml',
        'https://www.nepalpress.com/feed/',
        'https://onlinekhabar.com/feed',
        'https://www.ratopati.com/feed',
        'https://www.sanghunews.com/feed',
        'https://techpana.com/rss',
        'https://www.ukeraa.com/feed',
        'https://thahakhabar.com/rss',
        'https://deshsanchar.com/feed'
    ]
};

// Determine the category from the URL hash
let category = window.location.hash.substring(1) || 'construction-news'; // Default to 'construction-news'
let userFeedURLs = feedURLs[category] || [];

// Error handling if no feeds exist for the category
if (userFeedURLs.length === 0) {
    alert('No feeds for this category');
}

// Function to fetch news using rss2json API
userFeedURLs.forEach(userUrl => {
//function fetchNewsFromRSS2JSON(userUrl) {
    const apiKey = getRSS2JSONApiKey(); // Get the next API key from the list
    const apiUrl = `${RSS2JSON_API}${feedUrl}&api_key=${apiKey}`;

    return $.ajax({
        type: 'GET',
        url: apiUrl,
        dataType: 'jsonp',
        success: function (data) {
            displayFeedData(data);
        },
        error: function () {
            console.error('Error fetching the feed from RSS2JSON.');
        }
    });
}

// Function to fetch news using feed2json API from Toptal
userFeedURLs.forEach(userUrl => {
//function fetchNewsFromFeed2JSON(userUrl) {
    const apiUrl = `${FEED2JSON_API}${encodeURIComponent(feedUrl)}`;

    return $.ajax({
        type: 'GET',
        url: apiUrl,
        dataType: 'json',
        success: function (data) {
            displayFeedData(data);
        },
        error: function () {
            console.error('Error fetching the feed from Feed2JSON.');
        }
    });
}

// Function to display feed data on the page
function displayFeedData(data) {
    // Sort items by published date in descending order (newest first)
    data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Clear previous content
    var content = document.getElementById('content');
    content.innerHTML = '<div class="card-deck"></div>'; // Create a card-deck container

    data.items.forEach(item => {
        var cardDeck = document.querySelector('.card-deck');

        // Create a new item container
        var newItem = "";
        newItem += "<div class=\"card\">";
        newItem += "<div class=\"card-body\">";
        newItem += "<h5 class=\"card-title\"><a href=\"" + item.link + "\" target=\"_blank\">" + item.title + "</a></h5>";

        // Remove 'from Google Alert -...' if it exists
        let description = item.description.replace(/from Google Alert -.*?<br>/i, '');

        newItem += "<h6 class=\"card-subtitle mb-2 text-muted\">Published Date: " + item.pubDate + "</h6>";
        newItem += "<p class=\"card-text\">" + description + "</p>";
        newItem += "</div></div>";

        cardDeck.insertAdjacentHTML('beforeend', newItem);
    });
}

// Function to handle fetching from either API
function fetchNews(feedUrl) {
    // Try fetching from rss2json first, and if it fails, fall back to feed2json
    fetchNewsFromRSS2JSON(feedUrl).fail(function() {
        // If rss2json fails, fallback to Toptal's feed2json API
        console.log("Falling back to feed2json API...");
        fetchNewsFromFeed2JSON(feedUrl);
    });
}

// Load all feeds for the category
userFeedURLs.forEach(feedUrl => {
    fetchNews(feedUrl);
});

// Add infinite scrolling
$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        userFeedURLs.forEach(feedUrl => {
            fetchNews(feedUrl);
        });
    }
});
