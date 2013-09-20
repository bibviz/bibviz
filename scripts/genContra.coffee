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

processBody = (link, body, done) ->
    console.error "Processing #{link}"
    $ = cheerio.load body, ignoreWhitespace: true

    title = null
    table = $('table table')
    if table.find('td').length > 3
        table = table.find('table')
    verses = null
    lastBook = null

    addRef = (title, ref) ->
        if verses is null
            verses = if title then {} else []

        # Multiple verses can be given in one link, seperated by a comma
        for verse in $(ref).text().split ','
            # Try to match "[number] Book"
            match = /(^\d?\s?[a-z]+)/i.exec verse
            if match
                # Make sure it's one of the known books
                if match[1] in bookNames
                    lastBook = match[1]
                    if title
                        verses[title] ?= []
                        verses[title].push verse
                    else
                        verses.push verse
            else
                # No book? Maybe just a number, so re-use last book
                # Handles stuff like 'John 2:11, 3:1'
                justNum = /^(\d+):/.exec verse
                if justNum
                    if title
                        verses[title] ?= []
                        verses[title].push verse
                    else
                        verses.push "#{lastBook} #{verse}"

    if table.length and table.find('td').length > 1
        caption = $('title').text()
        #caption = table.find('caption').text().trim().replace(/(\r\n|\n|\r)/gm, ' ').replace /\s+/gm, ' '

        titles = []
        table.find('th i').each (i, child) ->
            titles.push $(child).text()

        #console.log titles

        table.find('td').each (i, child) ->
            title = titles[i]
            #console.log title
            $(child).find('a').each (i, ref) ->
                #console.log $(ref).text()
                addRef title, ref
    else
        dl = $('table dl')
        caption = $('table h3').text().trim().replace(/(\r\n|\n|\r)/gm, ' ').replace /\s+/gm, ' '
        if not caption
            caption = $('table caption').first().text().trim().replace(/(\r\n|\n|\r)/gm, ' ').replace /\s+/gm, ' '

        $(dl).find('dt, dd').each (i, child) ->
            if child.name is 'dt'
                title = $(child).find('i').first().text()
            else
                $(child).children('a').each (j, ref) ->
                    addRef title, ref

    if verses and Object.keys(verses).length
        contra.push
            desc: caption
            refs: verses
            url: link
    else
        console.error "Failure! ------> #{link}"

    #console.log caption + ' ' + verses.join(', ')

    done()

fetch = (link, done) ->
    sleep 1
    #console.log rootUrl + link
    needle.get rootUrl + link, (err, res, body) ->
        if err then return done(err)
        processBody link, body, done

getAll = ->
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

            console.log JSON.stringify(contra, null, 2)

getLocal = (path) ->
    body = fs.readFileSync path, 'utf-8'
    processBody null, body, (err) ->
        if err then console.log(err)

        console.log JSON.stringify(contra, null, 2)

if process.argv.length > 2
    getLocal process.argv[2]
else
    getAll()
