#!/usr/bin/env coffee

{bookNames, bookNormalize} = require './common'
cheerio = require 'cheerio'
needle = require 'needle'

contra = {}
desc = null

needle.get 'http://www.infidels.org/library/modern/jim_meritt/bible-contradictions.html', (err, res, body) ->
    if err then return done(err)
    $ = cheerio.load body, ignoreWhitespace: true

    page = $('#navpos_tab td').each (i, item) ->
        for child in item.children
            if child.name is 'h3'
                desc = $(child).text().trim()
                #console.log desc

            if child.name is 'p'
                #console.log $(child).text()
                re = /(?:[1-9]\s*)?[a-z]+\s*?\d+:\d+/gi
                text = $(child).text()
                matches = []
                while match = re.exec text
                    ref = bookNormalize match[0]

                    contra[desc] ?=
                        desc: desc
                        refs: []

                    contra[desc].refs.push ref

    console.log(JSON.stringify (v for own k, v of contra), null, 2)
