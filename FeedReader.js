let API = "https://api.rss2json.com/v1/api.json?rss_url=";

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

    // Check if valid category
    if (!feedURLs[category]) {
        console.error('No feeds found for this category');
        return;
    }

    let userFeedURLs = feedURLs[category];

    userFeedURLs.forEach(userUrl => {
        console.log('Fetching from URL:', userUrl);  // Debugging info
        
        $.ajax({
            type: 'GET',
            url: API + userUrl,
            dataType: 'jsonp',
            success: function (data) {
                console.log('Data received:', data);  // Debugging info
                
                if (!data.items || data.items.length === 0) {
                    console.warn('No news items found in feed:', userUrl);
                    return;
                }

                data.items.forEach(item => {
                    let newItem = document.createElement('div');
                    newItem.classList.add('news-item', 'col-lg-4', 'col-md-6', 'col-sm-12');
                    
                    let thumbnail = item.thumbnail || 'https://via.placeholder.com/150';  // Default blank image
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
            },
            error: function (err) {
                console.error('Error fetching the feed:', err);  // Error logging
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
        loadFeeds(this.getAttribute('data-category'));
    });
});
