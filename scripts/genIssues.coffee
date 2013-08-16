#!/usr/bin/env coffee

cheerio = require 'cheerio'
fs = require 'fs'

{bookNames} = require './common'

data = fs.readFileSync process.argv[2], 'utf-8'

# Remove scripts
data = data.replace /<script.*?>[\s\S]*?<\/script>/gmi, ''

$ = cheerio.load data, ignoreWhitespace: true

stats = for book in bookNames
    stat =
        name: book
        refs: []
        verseCount: 0
        relativeCount: 0
        url: null
longest = 0

book = null
$('p').each (i, item) ->
    item = $(item)

    child = item.children()[0]
    
    switch child?.name
        when 'b'
            bookName = $(child).text()
            book = stats.filter((i) -> i.name is bookName)[0]
            book.url = $(child).find('a').attr('href').replace /^\.*\//, ''
        when 'li'
            #content = $(child).text().replace /(\r\n|\n|\r|\s+)/gm, ' '

            # Remove weird trailing p tag content from lack of closing p tags
            #content = content.replace /SAB Bookstore[\s\S]*?Apocrypha/, ''

            $(child).children('a').each (j, link) ->
                # Only match internal refs to the current book
                verses = /(\d+:(\d+)-?(\d+)?)/.exec $(link).text()

                if verses
                    book.refs.push verses[1]

                    if verses[3]
                        # Verse identifiers are inclusive, so diff + 1
                        book.verseCount += verses[3] - verses[2] + 1
                    else
                        book.verseCount++

            longest = Math.max(longest, book.verseCount)

    return true

for stat in stats
    stat.relativeCount = stat.verseCount / longest

console.log JSON.stringify(stats)
