let API = "https://api.rss2json.com/v1/api.json?rss_url=";

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
userFeedURLs.forEach(userUrl => {
    $.ajax({
        type: 'GET',
        url: API + userUrl,
        dataType: 'jsonp',
        success: function (data) {
            console.log(data);

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
                newItem += "<h5 class=\"card-title\">" + item.title + "</h5>";
                
                // Remove 'from Google Alert -...' if it exists
                let description = item.description.replace(/from Google Alert -.*?<br>/i, '');
                
                newItem += "<h6 class=\"card-subtitle mb-2 text-muted\">Published Date: " + item.pubDate + "</h6>";
                newItem += "<p class=\"card-text\">" + description + "</p>";
                newItem += "</div></div>";

                cardDeck.insertAdjacentHTML('beforeend', newItem);
            });
        }
    });
});
