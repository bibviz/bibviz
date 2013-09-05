###
Blog helpers. This adds a function to get a list of articles
published on the site.
###

module.exports = (env, callback) ->
    # Get a list of articles in descending date order
    env.getArticles = (contents) ->
        articles = contents['blog']._.directories.map (item) -> item.index
        articles.sort (a, b) -> b.date - a.date

    # Convert a piece of HTML from relative or absolute links to full URLs
    env.absLinks = (content, baseUrl='http://bibviz.com') ->
        content.replace /((href|src)=")\//gi, "$1#{baseUrl}/"

    callback()
