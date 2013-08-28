###
Blog helpers. This adds a function to get a list of articles
published on the site.
###

module.exports = (env, callback) ->
    env.getArticles = (contents) ->
        articles = contents['blog']._.directories.map (item) -> item.index
        articles.sort (a, b) -> b.date - a.date

    callback()
