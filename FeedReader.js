// Define two API URLs for rss2json and feed2json
let rss2jsonAPI = "https://api.rss2json.com/v1/api.json?rss_url=";
let feed2jsonAPI = "https://www.toptal.com/developers/feed2json/convert?url=";

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

// Define publisher names based on domain
const publisherNames = {
    'onlinekhabar.com': 'Onlinekhabar',
    'nepalpress.com': 'Nepalpress',
    'arthasarokar.com': 'Arthasarokar',
    'arthadabali.com': 'Arthadabali',
    'arthapath.com': 'Arthapath',
    'bajarkochirfar.com': 'Bajarkochirfar',
    'bizmandu.com': 'Bizmandu',
    'corporatenepal.com': 'Corporatenepal',
    'nepsebajar.com': 'Nepsebajar',
    'annapurnapost.com': 'Annapurnapost',
    'bbc.com': 'BBC',
    'ratopati.com': 'Ratopati',
    'sanghunews.com': 'Sanghunews',
    'techpana.com': 'Techpana',
    'ukeraa.com': 'Ukera',
    'thahakhabar.com': 'Thahakhabar',
    'deshsanchar.com': 'Deshsanchar'
};

// Determine the category from the URL hash
let category = window.location.hash.substring(1) || 'construction-news'; // Default to 'construction-news'
let userFeedURLs = feedURLs[category] || [];

// Error handling if no feeds exist for the category
if (userFeedURLs.length === 0) {
    alert('No feeds for this category');
}

// Variables to manage API fallback
let rss2jsonLimitReached = false;
let currentAPI = rss2jsonAPI;

// Array to hold all fetched items
let allItems = [];

// Function to extract domain from URL
function getDomainFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (e) {
        console.error('Invalid URL:', url);
        return '';
    }
}

// Function to fetch news from the current API
function fetchNews(feedUrl) {
    let apiUrl = currentAPI + encodeURIComponent(feedUrl);

    $.ajax({
        type: 'GET',
        url: apiUrl,
        dataType: 'jsonp', // jsonp for rss2json, json for feed2json
        success: function (data) {
            allItems = allItems.concat(data.items); // Add fetched items to the array
            // Check if all URLs have been processed
            if (allItems.length >= userFeedURLs.length) {
                handleFeedData(); // Call handleFeedData after all URLs are processed
            }
        },
        error: function () {
            console.log("Error fetching from " + currentAPI);
        },
        statusCode: {
            429: function() { // 429 indicates rate limit exceeded for rss2json
                if (!rss2jsonLimitReached) {
                    console.log("rss2json API limit reached. Switching to feed2json.");
                    rss2jsonLimitReached = true;
                    currentAPI = feed2jsonAPI; // Switch to feed2json
                    // Retry fetching using feed2json for all URLs
                    userFeedURLs.forEach(feedUrl => fetchNews(feedUrl));
                }
            }
        }
    });
}

// Function to handle and display the feed data
function handleFeedData() {
    // Sort items by published date in descending order (newest first)
    allItems.sort((a, b) => new Date(b.pubDate || b.date_published) - new Date(a.pubDate || a.date_published));

    // Clear previous content
    var content = document.getElementById('content');
    if (!content.querySelector('.card-deck')) {
        content.innerHTML = '<div class="card-deck"></div>'; // Create a card-deck container only once
    }

    var cardDeck = document.querySelector('.card-deck');

    allItems.forEach(item => {
        // Create a new item container
        var newItem = "";
        newItem += "<div class=\"card\">";
        newItem += "<div class=\"card-body\">";
        newItem += "<h5 class=\"card-title\"><a href=\"" + item.url + "\" target=\"_blank\">" + item.title + "</a></h5>";

        // Handle differences in description format
        let description = item.content_html || item.description || item.summary || 'No description available';

        // Extract domain and get publisher name
        let domain = getDomainFromUrl(item.url || item.guid);
        let publisher = publisherNames[domain] || 'Unknown'; 

        // Convert date to local time zone
        let pubDate = new Date(item.pubDate || item.date_published);
        let localDate = pubDate.toLocaleString(); // Converts to local time zone

        newItem += "<h6 class=\"card-subtitle mb-2 text-muted\">Published Date: " + localDate + "</h6>";
        newItem += "<h6 class=\"card-subtitle mb-2 text-muted\">Publisher: " + publisher + "</h6>";
        newItem += "<p class=\"card-text\">" + description + "</p>";
        newItem += "</div></div>";

        cardDeck.insertAdjacentHTML('beforeend', newItem);
    });
}

// Iterate over each feed URL and fetch using the first API (rss2json) until the limit is hit
userFeedURLs.forEach(userUrl => {
    fetchNews(userUrl);
});

// Add infinite scrolling (optional)
$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        userFeedURLs.forEach(feedUrl => {
            fetchNews(feedUrl);
        });
    }
});
