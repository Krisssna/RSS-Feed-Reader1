const API = "https://api.rss2json.com/v1/api.json?rss_url=";

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

function loadFeeds(category) {
    let userFeedURLs = feedURLs[category] || [];
    $('#news-container').empty(); // Clear previous content

    userFeedURLs.forEach(userUrl => {
        $.ajax({
            type: 'GET',
            url: API + userUrl,
            dataType: 'json',
            success: function (data) {
                console.log(data);

                // Sort items by published date in descending order (newest first)
                data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

                data.items.forEach(item => {
                    var newItem = "<div class=\"col-md-4 mb-3\">";
                    newItem += "<div class=\"card\">";
                    newItem += "<div class=\"card-img-top\">No Image</div>"; // Blank placeholder
                    newItem += "<div class=\"card-body\">";
                    newItem += "<h5 class=\"card-title\"><a href=\"" + item.link + "\" target=\"_blank\">" + item.title + "</a></h5>";

                    // Limit description to 5 lines
                    let description = item.description.replace(/<br\s*\/?>/gi, ' ').split(' ').slice(0, 50).join(' ') + '...';

                    newItem += "<p class=\"card-text\">" + description + "</p>";
                    newItem += "</div></div></div>";

                    $('#news-container').append(newItem);
                });
            },
            error: function () {
                console.error("Error fetching feed data.");
            }
        });
    });
}

$(document).on('click', '.btn-category', function () {
    let category = $(this).data('category');
    $('#news-container').empty(); // Clear previous content
    loadFeeds(category);
});
