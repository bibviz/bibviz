#!/usr/bin/env coffee

bookNames = './common'
fs = require 'fs'
readline = require 'readline'
{WordTokenizer} = require 'natural'

# Bible count data
data =
    version: 'kvj'
    wordCount: 0
    charCount: 0
    sections: []

# Max words per section, book, chapter
max =
    section: 0
    book: 0
    chapter: 0

lastLine = null

section =
    name: 'Old Testament'
    wordCount: 0
    charCount: 0
    relativeLength: 0
    books: []
book = null
bookCount = 0
chapter = null

tokenizer = new WordTokenizer()

data.sections.push section

capitalize = (str, lower) ->
    (if lower then str.toLowerCase() else str).replace /(?:^|\s)\S/g, (a) -> a.toUpperCase()

rli = readline.createInterface
    input: fs.createReadStream process.argv[2]
    output: process.stdout
    terminal: false

rli.on 'line', (line) ->
    if line
        if line is 'THE END OF THE OLD TESTAMENT'
            # This is a new section
            section =
                name: 'New Testament'
                wordCount: 0
                charCount: 0
                relativeLength: 0
                books: []
            book = null
            chapter = null

            data.sections.push section

            return

        match = /^(CHAPTER|PSALM)\s+\d+/.exec line

        if match
            # This is a new chapter
            if match[0] is 'CHAPTER 1' or match[0] is 'PSALM 1'
                bookName = lastLine
                book =
                    name: capitalize bookName, true
                    shortName: bookNames[bookCount]
                    wordCount: 0
                    charCount: 0
                    chapters: []
                section.books.push book
                bookCount++

            chapterName = match[0].toLowerCase()
            chapter =
                name: capitalize chapterName, true
                wordCount: 0
                charCount: 0
                relativeLength: 0
                verseCount: 0
            book.chapters.push chapter
        else if chapter
            # Just a line - if we are in a chapter then it's a verse, so update totals
            # Verses must start with a number, this skips titles of the next book/chapter
            verseMatch = /^\d+\s(.*)/.exec(line)

            if verseMatch
                verse = /^\d+\s(.*)/.exec(line)[1]
                words = tokenizer.tokenize(verse).length
                data.wordCount += words
                data.charCount += verse.length
                section.wordCount += words
                section.charCount += verse.length
                book.wordCount += words
                book.charCount += verse.length
                chapter.wordCount += words
                chapter.charCount += verse.length
                chapter.verseCount++

                # Update maximums for relative lengths
                if section.wordCount > max.section
                    max.section = section.wordCount

                if book.wordCount > max.book
                    max.book = book.wordCount

                if chapter.wordCount > max.chapter
                    max.chapter = chapter.wordCount

        lastLine = line

rli.on 'close', ->
    lengths = []

    for name, section of data.sections
        section.relativeLength = (section.wordCount / max.section).toFixed(2)

        for book in section.books
            book.relativeLength = (book.wordCount / max.book).toFixed(2)

            for chapter in book.chapters
                chapter.relativeLength = (chapter.wordCount / max.chapter).toFixed(2)

    console.log JSON.stringify(data)
