let API = "https://api.rss2json.com/v1/api.json?rss_url=";

// Define feed URLs for each category
let feedsByCategory = {
    'Construction News': [
        "https://www.google.com/alerts/feeds/06313983183609550648/86313983183609550648/863422411556577025",
        "https://www.google.com/alerts/feeds/06313983183609550648/16219506770346016876",
        "https://www.google.com/alerts/feeds/06313983183609550648/16120492411931428893",
        "https://www.google.com/alerts/feeds/06313983183609550648/9874521726757945814",
        "https://www.google.com/alerts/feeds/06313983183609550648/13722836873792678019",
        "https://www.google.com/alerts/feeds/06313983183609550648/17566939723916288150",
        "https://www.google.com/alerts/feeds/06313983183609550648/7361213428763324582",
        "https://www.google.com/alerts/feeds/06313983183609550648/8196542214144987233"
    ],
    'Share Market': [
        "https://arthasarokar.com/feed",
        "https://arthadabali.com/feed",
        "https://www.arthapath.com/feed",
        "https://bajarkochirfar.com/feed",
        "https://bizmandu.com/feed",
        "https://www.corporatenepal.com/rss",
        "https://www.nepsebajar.com/feed"
    ],
    'Nepali News': [
        "https://annapurnapost.com/rss",
        "https://www.bbc.com/nepali/index.xml",
        "https://www.nepalpress.com/feed/",
        "https://onlinekhabar.com/feed",
        "https://www.ratopati.com/feed",
        "https://www.sanghunews.com/feed",
        "https://techpana.com/rss",
        "https://www.ukeraa.com/feed",
        "https://thahakhabar.com/rss",
        "https://deshsanchar.com/feed"
    ]
};

// Function to fetch and display feeds
function loadFeeds(category) {
    let userFeedURLs = feedsByCategory[category] || [];
    userFeedURLs.forEach(userUrl => {
        $.ajax({
            type: 'GET',
            url: API + userUrl,
            dataType: 'jsonp',
            success: function (data) {
                console.log(data);
                data.items.forEach(item => {
                    var content = document.getElementById('content');

                    var newItem = "";
                    newItem += "<div class=\"container\" id=\"item\"><a href=\"" + item.link + "\"><h1>" + item.title + "</h1></a>" + "<h4> from " + data.feed.title + "</h4>";
                    if (item.author != "")
                        newItem += "<h4> By " + item.author + "</h4>";

                    newItem += "<h4>Published Date: " + item.pubDate + "</h4>";

                    newItem += item.description + "<hr></div>";

                    content.insertAdjacentHTML('beforeend', newItem);
                });
            }
        });
    });
}
