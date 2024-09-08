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

// Function to load feeds based on the category selected
function loadFeeds(category) {
    let content = document.getElementById('content');
    content.innerHTML = ''; // Clear previous content

    let userFeedURLs = feedURLs[category] || [];
    userFeedURLs.forEach(userUrl => {
        $.ajax({
            type: 'GET',
            url: API + userUrl,
            dataType: 'jsonp',
            success: function (data) {
                // Sort items by published date in descending order (newest first)
                data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

                data.items.forEach(item => {
                    // Create a new item container
                    let newItem = document.createElement('div');
                    newItem.classList.add('news-item', 'col-lg-4', 'col-md-6', 'col-sm-12');
                    
                    // Create the thumbnail image or fallback to blank if none exists
                    let thumbnail = item.thumbnail || 'path/to/placeholder.png';
                    newItem.innerHTML = `
                        <div class="news-box">
                            <a href="${item.link}" target="_blank">
                                <img src="${thumbnail}" alt="thumbnail" class="news-thumbnail">
                                <h3>${item.title}</h3>
                            </a>
                            <p class="news-date">Published: ${new Date(item.pubDate).toLocaleDateString()}</p>
                            <p class="news-description">${item.description.split(' ').slice(0, 30).join(' ')}...</p>
                        </div>
                    `;

                    content.appendChild(newItem);
                });
            }
        });
    });
}

// Hide other categories when one is clicked
document.querySelectorAll('.btn-category').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.btn-category').forEach(btn => {
            if (btn !== this) {
                btn.style.display = 'none'; // Hide other buttons
            }
        });
    });
});
