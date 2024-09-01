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

// Function to load feeds and manage visibility
function loadFeeds(category) {
    // Clear the content area
    let content = document.getElementById('content');
    content.innerHTML = '';

    // Hide buttons and show only the selected category's button
    document.getElementById('btn-construction').style.display = 'none';
    document.getElementById('btn-share').style.display = 'none';
    document.getElementById('btn-nepali').style.display = 'none';
    
    if (category === 'construction-news') {
        document.getElementById('btn-construction').style.display = 'block';
    } else if (category === 'share-market') {
        document.getElementById('btn-share').style.display = 'block';
    } else if (category === 'nepali-news') {
        document.getElementById('btn-nepali').style.display = 'block';
    }

    // Load the selected category's feed
    let userFeedURLs = feedURLs[category] || [];
    userFeedURLs.forEach(userUrl => {
        $.ajax({
            type: 'GET',
            url: API + userUrl,
            dataType: 'jsonp',
            success: function (data) {
                // Sort and display the feed items
                data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                data.items.forEach(item => {
                    var newItem = "";
                    newItem += "<div class=\"container\" id=\"item\"><a href=\"" + item.link + "\"><h1>" + item.title + "</h1></a>";
                    let description = item.description.replace(/from Google Alert -.*?<br>/i, '');
                    newItem += "<h4>Published Date: " + item.pubDate + "</h4>";
                    newItem += description + "<hr></div>";
                    content.insertAdjacentHTML('beforeend', newItem);
                });
            }
        });
    });
}

// Load the default category when the page loads
document.addEventListener("DOMContentLoaded", function() {
    let category = window.location.hash.substring(1) || 'construction-news';
    loadFeeds(category);
});
