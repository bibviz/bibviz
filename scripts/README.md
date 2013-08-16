Scripts
=======
This directory contains scripts used to generate the JSON data. Currently, all data is generated from pages on the Skeptic's Annotated Bible website.

Installation
------------
These scripts have few dependencies and should work on Windows, Linux, and Mac OS X. First, install Node.js and then run the following:

```bash
cd scripts
npm install
```

You are now ready to generate the data.

Generating the Data
-------------------
There are three types of data files to generate.

### General Stats
Generates overall statistics on a particular version of the Bible, in our case the 1611 Authorized King James Version. Output includes each section, book, and chapter along with word and character counts and relative length compared to other books/chapters.

```bash
gunzip kjv.txt.gz
./bstats.coffee kjv.txt >../web/kjv.json
```

### Contradictions
Generates statistics about contradictions by fetching many files. This command can take a while to run as it sleeps between each URL fetch to prevent hammering the server.

```bash
./genContra.coffee >../web/contra.json
```

### Issues
Generates statistics about a particular issue. Several cached pages are available in the `cache` directory, e.g. `science.html` which is used to generate the `web/science.json` data file which in turn is used to create the science and history chart on the final web page. New pages or updating the cached pages can be accomplished with `curl`.

```bash
curl http://some-website/page.html >abc.html
coffee genIssues.coffee --nodejs '--stack-size=99999' abc.html >../web/abc.json'
```
