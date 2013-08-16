#!/usr/bin/env coffee

async = require 'async'
{bookNames} = require './common'
cheerio = require 'cheerio'
fs = require 'fs'
needle = require 'needle'
{sleep} = require 'sleep'

rootUrl = 'http://www.skepticsannotatedbible.com/contra/'
index = 'by_name.html'

links = []
contra = []

# Some links use the singular
bookNames.push 'Psalm'

fetch = (link, done) ->
    sleep 1
    #console.log rootUrl + link
    needle.get rootUrl + link, (err, res, body) ->
        if err then return done(err)
        $ = cheerio.load body, ignoreWhitespace: true
        
        table = $('table table')

        caption = table.find('caption').text().replace(/(\r\n|\n|\r)/gm, ' ').replace /\s+/gm, ' '

        verses = []
        lastBook = null
        table.find('a').each (i, ref) ->
            # Multiple verses can be given in one link, seperated by a comma
            for verse in $(ref).text().split ','
                # Try to match "[number] Book"
                match = /(^\d?\s?[a-z]+)/i.exec verse
                if match
                    # Make sure it's one of the known books
                    if match[1] in bookNames
                        lastBook = match[1]
                        verses.push verse
                else
                    # No book? Maybe just a number, so re-use last book
                    # Handles stuff like 'John 2:11, 3:1'
                    justNum = /^(\d+):/.exec verse
                    if justNum
                        verses.push "#{lastBook} #{verse}"

        if verses.length
            contra.push
                desc: caption
                refs: verses
                url: link

        #console.log caption + ' ' + verses.join(', ')

        done()

needle.get rootUrl + index, (err, res, body) ->
    if err then return console.log(err)
    $ = cheerio.load body, ignoreWhitespace: true

    $('p li a').each (i, item) ->
        link = $(item).attr('href')

        if link then links.push link

    #console.log links
    #console.log links.length

    async.eachSeries links, fetch, (err) ->
        if err then return console.log(err)

        console.log JSON.stringify(contra)
