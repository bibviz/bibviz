var bData = null;
var bookToChapter = {};
var bookToChapterCount = {};
var maxLength = 250;

var contra = null;
var contraFilters = {
    source: window._contraSource ? window._contraSource : 'sab', /* Source of data, default SAB */
    book: null,         /* Specific book name */
    chapter: null,      /* Specific absolute chapter */
    type: null,         /* Specific contradiction type */
    search: null,       /* Text to search for via regex */
    refCount: null,     /* Specific range of references */
    crossBook: false,   /* Only show cross-book contradictions */
    colorize: 'Crimson' /* Colorize the arcs */
};

var searchHashTimer = null;

if (!window.maxArcs) {
    var maxArcs = 10;
}

// Available contradiction types
var contraTypeFilters = {
    'All': null,
    'Count': /(how (many|old))|(sixth)/i,
    'People': /(^\s*who)|(whom)|(whose)|(sons? of)|(mother)|(father)|(offspring)|(genealogy)|(related)/i,
    'Time': /(^\s*when)|(what day)|(which came first)/i,
    'Location': /(where)|(road)|(mountain)|(from the)/i,
    'Death': /(heaven)|(hell)|(die)|(death)|(lifespan)|(congregation of the lord)|(live long)/i,
    'Love': /(marry)|(marriage)|(love)|(sex)|(homosexual)|(conceive)|(wife)|(childbearing)|(adulterer)/i,
    'God': /god/i,
    'Jesus': /jesus/i,
    'Other': null
};

// Get the URL hash as an object of key:value pairs
function getParsedHash() {
    var hash = {};

    var parts = window.location.hash.substr(1).split(',');
    for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split(':');

        if (kv && kv.length > 1) {
            hash[kv[0]] = kv[1].replace('+', ' ');
        }
    }

    return hash;
}

// Set the URL hash from an object of key:value pairs
// Tries to replace history state rather than adding onto the stack
function setHash(values) {
    var hashArray = [];

    var keys = Object.keys(values);
    for (var i = 0; i < keys.length; i++) {
        if (values[keys[i]] !== undefined && values[keys[i]] !== null) {
            hashArray.push(keys[i] + ':' + values[keys[i]].replace(' ', '+'));
        }
    }

    hashArray.sort();

    if (window.history && window.history.replaceState) {
        var base = window.location.href.split('#')[0];

        window.history.replaceState(null, null, base + '#' + hashArray.join(','));

        setFiltersFromHash();
        renderContra();
    } else {
        window.location.hash = hashArray.join(',');
    }
}

// Update one or more key:value pairs in the URL hash
// Set a value to null or undefined to remove it completely.
function updateHash(values) {
    var updated = getParsedHash();

    var keys = Object.keys(values);
    for (var i = 0; i < keys.length; i++) {
        updated[keys[i]] = values[keys[i]];
    }

    setHash(updated);
}


// Set the selected <option> on a <select> element by
// selector id and value
function updateSelect(id, value) {
    var selector = document.getElementById(id);

    for (var i = 0; i < selector.options.length; i++) {
        var option = selector.options[i];

        if (option.value == value) {
            selector.selectedIndex = i;
            break;
        }
    }
}

function setFiltersFromHash() {
    var _parsedHash = getParsedHash();

    if (_parsedHash.source) {
        contraFilters.source = _parsedHash.source;
        updateSelect('source-select', contraFilters.source);
    }

    if (_parsedHash.book) {
        contraFilters.book = _parsedHash.book;
        updateSelect('book-select', contraFilters.book);
    } else {
        contraFilters.book = null;
    }

    if (_parsedHash.type) {
        contraFilters.type = _parsedHash.type;
        updateSelect('type-select', contraFilters.type);
    } else {
        contraFilters.type = null;
    }

    if (_parsedHash.colorize) {
        contraFilters.colorize = _parsedHash.colorize;
        updateSelect('color-select', contraFilters.colorize);
    }

    if (_parsedHash.search) {
        contraFilters.search = _parsedHash.search;
        document.getElementById('text-search').value = contraFilters.search;
    }
}

window.onhashchange = function () {
    setFiltersFromHash();
    renderContra();
};

// Returns true if a new tab should be opened from a click
function newTab() {
    return (window.event && ((event.which == 1 && (event.ctrlKey === true || event.metaKey === true) || (event.which == 2))));
}

function getAbsoluteChapter(verse) {
    var parts = /^(\d?\s?[a-z]+)[\s.:]*(\d*):?(\d*)[-]?(\d*)/i.exec(verse);
    //console.log(parts);
    if (parts === null) return;

    var chapter = bookToChapter[parts[1]];
    chapter = (chapter === undefined) ? bookToChapter[parts[1] + 's'] : chapter;

    return chapter + parseInt(parts[2]);
}

/*
    Make sure we have a flat list of refs to filter or render.
    This handles the following two cases and returns a flat,
    plain list:

    ['Ref 1', 'Ref 2', ...]

    {
        'Some desc': ['Ref 1', 'Ref 2'],
        'Another': ['Ref 3', ...]
    }
*/
function flatRefs(refs) {
    var i, j, keys;

    if (refs instanceof Array) {
        refList = refs;
    } else {
        // This is an object with more info, so let's pull
        // out all the refs.
        refList = [];

        keys = Object.keys(refs);
        for (i = 0; i < keys.length; i++) {
            for (j = 0; j < refs[keys[i]].length; j++) {
                refList.push(refs[keys[i]][j]);
            }
        }
    }

    return refList;
}

function renderContra() {
    var textSearch = null;

    if (contraFilters.search) {
        textSearch = new RegExp(contraFilters.search, 'gi');
    }

    var chart = d3.select('#contradictions-chart')
        .selectAll('.arc')
        .data(contra[contraFilters.source].contradictions.filter(function (d) {
            var i, found, match, refList;

            refList = flatRefs(d.refs);

            // Filter out items that don't touch this chapter
            if (contraFilters.chapter !== null) {
                found = false;

                for (i = 0; i <= Math.min(refList.length - 1, 10); i++) {
                    if (getAbsoluteChapter(refList[i]) == contraFilters.chapter) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }

            // Filter out items that don't touch this book
            if (contraFilters.book !== null) {
                found = false;

                for (i = 0; i < Math.min(refList.length - 1, 10); i++) {
                    match = /(\d?\s*\w+)/.exec(refList[i]);

                    if (match && (match[1] == contraFilters.book || match[1] + 's' == contraFilters.book)) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }

            // Filter out the wrong type of item
            var regex;
            if (contraFilters.type !== null) {
                if (contraFilters.type == 'Other') {
                    // Exclude any of the listed types except 'All' and 'Other'
                    var keys = Object.keys(contraTypeFilters);
                    for (i = 0; i < keys.length; i++) {
                        regex = contraTypeFilters[keys[i]];
                        if (regex && regex.test(d.desc)) {
                            return false;
                        }
                    }
                } else {
                    // Include only this type
                    regex = contraTypeFilters[contraFilters.type];
                    if (regex && !regex.test(d.desc)) {
                        return false;
                    }
                }
            }

            if (textSearch !== null) {
                if (!textSearch.test(d.desc)) {
                    return false;
                }
            }

            return true;
        }),
        // Key function to compare values on insert/update/remove
        function (d) {
            return d.desc;
        });

    chart.enter().append('g')
        .attr('class', 'arc')
        .on('click', function (d) {
            var url = '/' + slugg(d.desc) + '-' + contraFilters.source + '.html';
            //var url = 'http://www.skepticsannotatedbible.com/contra/' + d.url;

            // Handle [cmd/ctrl]+click and middle click to open a new tab
            if (newTab()) {
                window.open(url);
            } else {
                window.location = url;
            }
        })
        .on('mouseover', function (d) {
            var refList = flatRefs(d.refs);

            d3.select('#contradictions-chart')
                .selectAll('.arc')
                .sort(function (a, b) {
                    return (a == d) ? 1 : -1;
                });

            d3.select('#selected')
                .html(d.desc + '<br/><span class="subdued">' + refList.join(', ').substr(0, maxLength) + '</span>');
        })
        .each(function (d, i) {
            var group = d3.select(this);
            var refList = flatRefs(d.refs);

            if (refList.length > 1) {
                // Only show up to 10 refs, some have over 100...
                for (x = 0; x <= Math.min(maxArcs, refList.length - 2); x++) {
                    var start = getAbsoluteChapter(refList[x]);
                    var end = getAbsoluteChapter(refList[x + 1]);

                    if (start > end) {
                        var tmp = end;
                        end = start;
                        start = tmp;
                    }

                    var r = (end - start) * 0.51;
                    var ry = Math.min(r, 490);

                    if (!isNaN(start) && !isNaN(end) && !isNaN(r) && !isNaN(ry)) {
                        var path = 'M ' + start + ',399 A ' + r + ',' + ry + ' 0 0,1 ' + end + ',399 ';
                        group.append('path')
                            .attr('d', path)
                            .style('stroke', function (start, end) {
                                return colorize(start, end);
                            }(start, end));
                    }
                }
            }
        });

    chart.exit()
        .transition()
            .duration(350)
            .style('opacity', 0)
        .remove();

    // Update any highlighting from filters
    d3.select('#contradictions-chart')
        .selectAll('rect')
        .classed('selected', false);

    if (contraFilters.book !== null) {
        d3.select('#contradictions-chart')
            .selectAll('.b' + contraFilters.book.replace(/\s+/g, '').toLowerCase())
            .classed('selected', true);
    }
}

// Clip a value between min and max, inclusive
function clip(min, value, max) {
    return Math.max(min, Math.min(value, max));
}

// Chooses a color for an arc from start to end
function colorize(start, end) {
    var color = 'crimson';
    var distance;

    if (contraFilters.colorize == 'Rainbow') {
        distance = Math.abs(end - start);
        color = d3.hsl(distance / 1189 * 360, 0.7, 0.35);
    }

    return color;
}

function issueBarChart(selector, data) {
    var element = d3.select('#' + selector);

    for (var i = 0; i < 4; i++) {
        var y = 100 / 4 * i;

        element.append('line')
            .attr('class', 'axis')
            .attr('x1', 0)
            .attr('x2', 1189)
            .attr('y1', y)
            .attr('y2', y);
    }

    element.selectAll('rect')
        .data(data)
        .enter().append('rect')
            .attr('class', function (d, i) {
                return i >= 39 ? 'nt ' + selector : selector;
            })
            .attr('x', function (d, i) {
                return bookToChapter[d.name];
            })
            .attr('y', function (d, i) {
                return 98 - (d.relativeCount * 98);
            })
            .attr('width', function (d, i) {
                return Math.max(1, bookToChapterCount[d.name] - 1);
            })
            .attr('height', function (d) {
                return d.relativeCount * 98 + 2;
            })
            .on('click', function (d, i) {
                var url = 'http://www.skepticsannotatedbible.com/' + d.url;

                if (newTab()) {
                    window.open(url);
                } else {
                    window.location = url;
                }
            })
            .on('mouseover', function (d, i) {
                var testament = i >= 39 ? 'New Testament' : 'Old Testament';
                d3.select('#selected')
                    .html(testament + ' - ' + d.name + ' - ' + d.verseCount + ' verses<br/><span class="subdued">' + d.refs.join(', ').substr(0, maxLength) + '</span>');
            });

    element.selectAll('text')
        .data(data)
        .enter().append('text')
            .attr('x', function (d) {
                return bookToChapter[d.name] + 4;
            })
            .attr('y', function (d) {
                return 109 - (d.relativeCount * 98);
            })
            .style('stroke', 'none')
            .style('fill', 'white')
            .style('font-size', '8pt')
            .style('opacity', '0.4')
            .text(function (d) {
                if (bookToChapterCount[d.name] >= 30 && d.verseCount && (d.relativeCount * 98 + 2) > 16) {
                    return d.verseCount;
                }
            });
}

d3.select('#selected').transition().delay(7000).duration(1000).style('opacity', 1.0);

d3.select('#filter-notice')
    .transition()
        .delay(1000)
        .duration(1000)
        .style('opacity', 1.0)
    .transition()
        .delay(4000)
        .duration(1000)
        .style('opacity', 0)
    .transition()
        .style('display', 'none');

d3.select('#contra-notice')
    .transition()
        .delay(4000)
        .duration(1000)
        .style('opacity', 1.0)
    .transition()
        .delay(7000)
        .duration(1000)
        .style('opacity', 0)
    .transition()
        .style('display', 'none');

d3.select('#langSelect')
    .on('change', function () {
        var lang = this.value;

        if (lang == 'new') {
            return window.location = '/translate.html';
        }

        var path = window.location.pathname;

        if (path[path.length - 1] == '/') {
            window.location = path + 'index' + (lang == 'en' ? '' : '-' + lang) + '.html';
        } else {
            var match = /(.*?)(-.*)?\.html/gi.exec(path);
            if (match) {
                path = match[1];
                window.location = match[1] + (lang == 'en' ? '' : '-' + lang) + '.html';
            }
        }
    });

d3.json('/data/kjv.json', function (err, json) {
    if (err) { console.log(err); }
    bData = json;

    var bookSelect = d3.select('#book-select');
    var chapters = [];
    var chapterCount = 0;

    for (var x = 0; x < json.sections.length; x++) {
        for (var y = 0; y < json.sections[x].books.length; y++) {
            bookSelect.append('option')
                .text(json.sections[x].books[y].shortName);
            bookToChapter[json.sections[x].books[y].shortName] = chapterCount;
            bookToChapterCount[json.sections[x].books[y].shortName] = 0;
            for (var z = 0; z < json.sections[x].books[y].chapters.length; z++) {
                chapterCount++;
                chapters.push({
                    section: json.sections[x].name,
                    book: json.sections[x].books[y].shortName,
                    chapter: json.sections[x].books[y].chapters[z]
                });
                bookToChapterCount[json.sections[x].books[y].shortName]++;
            }
        }
    }

    d3.json('/data/misogyny.json', function (err, json) {
        issueBarChart('misogyny-chart', json);
    });

    d3.json('/data/science.json', function (err, json) {
        issueBarChart('science-chart', json);
    });

    d3.json('/data/homosexual.json', function (err, json) {
        issueBarChart('homosexual-chart', json);
    });

    d3.json('/data/violence.json', function (err, json) {
        issueBarChart('violence-chart', json);
    });

    var svg = d3.select('#contradictions-chart');

    // Draw chapter length bars
    svg.selectAll('rect')
        .data(chapters)
        .enter().append('rect')
            .attr('class', function (d, i) {
                var testament = d.section == 'New Testament' ? 'nt' : '';
                var book = 'b' + d.book.replace(/\s+/g, '').toLowerCase();

                return testament + ' ' + book;
            })
            .attr('x', function (d, i) {return i;})
            .attr('y', 400)
            .attr('width', 1)
            .attr('height', function (d, i) {return d.chapter.relativeLength * 100;})
            .on('click', function (d) {
                var chapterNum = parseInt(d.chapter.name.split(' ')[1]);
                window.location = 'http://www.biblegateway.com/passage/?search=' + d.book + ' ' + chapterNum + '&version=KJV';
            })
            .on('mouseover', function (d) {
                /*contraFilters.book = null;
                contraFilters.chapter = getAbsoluteChapter(d.book + ' ' + d.chapter.name.split(' ')[1]);
                renderContra();*/
                d3.select('#selected')
                    .html(d.section + ' - ' + d.book + ' - ' + d.chapter.name + '<br/><span class="subdued">' + d.chapter.wordCount + ' words, ' + d.chapter.charCount + ' characters</span>');
            });

    if (window._contradictions !== undefined) {
        contra = _contradictions;

        renderContra();
    } else {
        d3.json('/data/contra.json', function (err, json) {
            contra = json;

            var sourceSelect = d3.select('#source-select');

            sourceSelect.selectAll('option')
                .data(Object.keys(contra))
                .enter().append('option')
                    .attr('value', function (d) { return d; })
                    .text(function (d) { return d; });

            sourceSelect.on('change', function () {
                updateHash({source: this.value});
            });

            // Initial call to setup the filters from the URL
            setFiltersFromHash();

            renderContra();
        });
    }

    bookSelect.on('change', function() {
        updateHash({book: this.value != 'All' ? this.value : null});
    });

    var typeSelect = d3.select('#type-select');

    typeSelect.selectAll('option').data(Object.keys(contraTypeFilters)).enter().append('option')
        .text(function (d) {return d; });

    typeSelect.on('change', function () {
        updateHash({type: this.value != 'All' ? this.value : null});
    });

    d3.select('#color-select')
        .on('change', function () {
            // Clear all current arcs so they get recreated
            d3.select('#contradictions-chart').selectAll('.arc').remove();

            // Set the filter
            updateHash({colorize: this.value});
        });

    d3.select('#text-search')
        .on('keyup', function () {
            var text = this.value;

            if (text.length) {
                contraFilters.search = text;
            } else {
                contraFilters.search = null;
            }

            renderContra();

            if (searchHashTimer) {
                clearTimeout(searchHashTimer);
            }

            searchHashTimer = setTimeout(function () {
                updateHash({search: text.length ? text : null});
            }, 500);
        });
});

// Pie charts
function createPie(selector, data, colors, text, hovers, url) {
    var pie = d3.layout.pie()
        .value(function (d) {return d;})
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(50)
        .outerRadius(100);

    var chart = d3.select(selector)
        .append('g')
            .attr('class', 'piechart')
            .attr('transform', 'translate(100, 100)')
        .datum(data).selectAll('path');

    chart
        .data(pie)
        .enter().append('path')
            .attr('fill', function(d, i) {return colors[i];})
            .attr('d', arc)
            .on('mouseover', function (d, i) {
                d3.select('#selected')
                    .html(d.value + '% ' + hovers[i]);
            })
            .on('click', function (d) {
                if (newTab()) {
                    window.open(url);
                } else {
                    window.location.href = url;
                }
            });

    d3.select(selector + ' g').append('text')
            .attr('dy', '10')
            .style('text-anchor', 'middle')
            .text(text);
}

createPie('#pCreation', [46, 54], ['crimson', 'steelblue'], '46%', [
    'believe in young Earth creationism.',
    'do not believe in young Earth creationism.'
], 'http://www.gallup.com/poll/155003/hold-creationist-view-human-origins.aspx');
createPie('#pCreationCollege', [25, 75], ['crimson', 'steelblue'], '25%', [
    'of college graduates believe in young Earth creationism.',
    'of college graduates do not believe in young Earth creationism.'
], 'http://www.gallup.com/poll/155003/hold-creationist-view-human-origins.aspx');
createPie('#pChristian', [51.9, 23.3, 2.1, 22.7], ['crimson', '#E02B50', '#E34363', 'steelblue'], '77%', [
    'are Protestant/Other Christian',
    'are Catholic',
    'are Mormon',
    'are not Christian'
], 'http://www.gallup.com/poll/159548/identify-christian.aspx');
createPie('#pReligious', [40, 29, 31], ['crimson', '#E02B50', 'steelblue'], '69%', [
    'are very religious',
    'are moderately religious',
    'are not religious'
], 'http://www.gallup.com/poll/159050/seven-americans-moderately-religious.aspx');


// ------------------------------------------

var defaultSeparator = '-';

function slugg(string, separator, toStrip) {

  // Separator is optional
  if (typeof separator === 'undefined') separator = defaultSeparator;

  // Separator might be omitted and toStrip in its place
  if (separator instanceof RegExp) {
    toStrip = separator;
    separator = defaultSeparator;
  }

  // Only a separator was passed
  if (typeof toStrip === 'undefined') toStrip = new RegExp('');

  // Swap out non-english characters for their english equivalent
  for (var i = 0, len = string.length; i < len; i++) {
    if (chars[string.charAt(i)]) {
      string = string.replace(string.charAt(i), chars[string.charAt(i)]);
    }
  }

  string = string
    // Make lower-case
    .toLowerCase()
    // Strip chars that shouldn't be replaced with separator
    .replace(toStrip, '')
    // Replace non-word characters with separator
    .replace(/[\W|_]+/g, separator)
    // Strip dashes from the beginning
    .replace(new RegExp('^' + separator + '+'), '')
    // Strip dashes from the end
    .replace(new RegExp(separator + '+$'), '');

  return string;

}

// Conversion table. Modified version of:
// https://github.com/dodo/node-slug/blob/master/src/slug.coffee
var chars = slugg.chars = {
  // Latin
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
  'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
  'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
  'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
  'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à': 'a', 'á': 'a',
  'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
  'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
  'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
  'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS', 'œ': 'oe', 'Œ': 'OE',
  // Greek
  'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h',
  'θ': '8', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3',
  'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f',
  'χ': 'x', 'ψ': 'ps', 'ω': 'w', 'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o',
  'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's', 'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y',
  'ΐ': 'i', 'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z',
  'Η': 'H', 'Θ': '8', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N',
  'Ξ': '3', 'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y',
  'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W', 'Ά': 'A', 'Έ': 'E', 'Ί': 'I',
  'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I', 'Ϋ': 'Y',
  // Turkish
  'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ğ': 'g', 'Ğ': 'G',
  // Russian
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': 'u',
  'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'А': 'A', 'Б': 'B',
  'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',
  'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
  'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H',
  'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': 'U', 'Ы': 'Y',
  'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  // Ukranian
  'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G',
  'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',
  // Czech
  'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's',
  'ť': 't', 'ů': 'u', 'ž': 'z', 'Č': 'C', 'Ď': 'D', 'Ě': 'E',
  'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U', 'Ž': 'Z',
  // Polish
  'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ś': 's',
  'ź': 'z', 'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'e', 'Ł': 'L',
  'Ń': 'N', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
  // Latvian
  'ā': 'a', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l',
  'ņ': 'n', 'ū': 'u', 'Ā': 'A', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'i',
  'Ķ': 'k', 'Ļ': 'L', 'Ņ': 'N', 'Ū': 'u'
}