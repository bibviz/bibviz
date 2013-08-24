var bData = null;
var bookToChapter = {};
var bookToChapterCount = {};
var maxLength = 250;

var contra = null;
var contraFilters = {
    book: null,         /* Specific book name */
    chapter: null,      /* Specific absolute chapter */
    type: null,         /* Specific contradiction type */
    refCount: null,     /* Specific range of references */
    crossBook: false,   /* Only show cross-book contradictions */
    colorize: 'Crimson' /* Colorize the arcs */
};

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
    'Jesus': /jesus/i
};

function getAbsoluteChapter(verse) {
    var parts = /^(\d?\s?[a-z]+)[\s.:]*(\d*):?(\d*)[-]?(\d*)/i.exec(verse);
    //console.log(parts);

    var chapter = bookToChapter[parts[1]];
    chapter = (chapter === undefined) ? bookToChapter[parts[1] + 's'] : chapter;

    return chapter + parseInt(parts[2]);
}

function renderContra() {
    var chart = d3.select('#contradictions-chart')
        .selectAll('.arc')
        .data(contra.filter(function (d) {
            var i, found, match;

            // Filter out items that don't touch this chapter
            if (contraFilters.chapter !== null) {
                found = false;

                for (i = 0; i <= Math.min(d.refs.length - 1, 10); i++) {
                    if (getAbsoluteChapter(d.refs[i]) == contraFilters.chapter) {
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

                for (i = 0; i < Math.min(d.refs.length - 1, 10); i++) {
                    match = /(\d?\s*\w+)/.exec(d.refs[i]);

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
            if (contraFilters.type !== null) {
                var regex = contraTypeFilters[contraFilters.type];
                if (regex && !regex.test(d.desc)) {
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
            window.location = 'http://www.skepticsannotatedbible.com/contra/' + d.url;
        })
        .on('mouseover', function (d) {
            d3.select('#contradictions-chart')
                .selectAll('.arc')
                .sort(function (a, b) {
                    return (a == d) ? 1 : -1;
                });

            d3.select('#selected')
                .html(d.desc + '<br/><span class="subdued">' + d.refs.join(', ').substr(0, maxLength) + '</span>');
        })
        .each(function (d, i) {
            var group = d3.select(this);

            if (d.refs.length > 1) {
                // Only show up to 10 refs, some have over 100...
                for (x = 0; x <= Math.min(10, d.refs.length - 2); x++) {
                    var start = getAbsoluteChapter(d.refs[x]);
                    var end = getAbsoluteChapter(d.refs[x + 1]);

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
                window.location = 'http://www.skepticsannotatedbible.com/' + d.url;
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

d3.select('#selected').transition().delay(8000).duration(1000).style('opacity', 1.0);

d3.select('#filter-notice')
    .transition()
        .delay(2000)
        .duration(1000)
        .style('opacity', 1.0)
    .transition()
        .delay(5000)
        .duration(1000)
        .style('opacity', 0)
    .transition()
        .style('display', 'none');

d3.select('#contra-notice')
    .transition()
        .delay(5000)
        .duration(1000)
        .style('opacity', 1.0)
    .transition()
        .delay(8000)
        .duration(1000)
        .style('opacity', 0)
    .transition()
        .style('display', 'none');

d3.json('./kjv.json', function (err, json) {
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

    d3.json('./misogyny.json', function (err, json) {
        issueBarChart('misogyny-chart', json);
    });

    d3.json('./science.json', function (err, json) {
        issueBarChart('science-chart', json);
    });

    d3.json('./homosexual.json', function (err, json) {
        issueBarChart('homosexual-chart', json);
    });

    d3.json('./violence.json', function (err, json) {
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

    d3.json('./contra.json', function (err, json) {
        contra = json;

        var html = '<tr>';
        for (x = 0; x < json.length; x++) {
            if ((x + 1) % 4 == 0) {
                html += '</tr><tr>';
            }

            html += '<td><a href="http://www.skepticsannotatedbible.com/contra/' + json[x].url + '">' + (x + 1) + ' ' + json[x].desc + '</a></td>';
        }
        html += '</tr>';
        d3.select('#contradictionsTable').html(html);

        renderContra();
    });

    bookSelect.on('change', function() {
        contraFilters.book = this.value != 'All' ? this.value : null;
        renderContra();
    });

    var typeSelect = d3.select('#type-select');

    typeSelect.selectAll('option').data(Object.keys(contraTypeFilters)).enter().append('option')
        .text(function (d) {return d; });

    typeSelect.on('change', function () {
        contraFilters.type = this.value;

        renderContra();
    });

    d3.select('#color-select')
        .on('change', function () {
            // Set the filter
            contraFilters.colorize = this.value;

            // Clear all current arcs so they get recreated
            d3.select('#contradictions-chart').selectAll('.arc').remove();

            renderContra();
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
                window.location.href = url;
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
