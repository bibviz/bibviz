var bData = null;
var bookToChapter = {};
var bookToChapterCount = {};
var maxLength = 250;

var contra = null;
var contraFilters = {
    book: null,         /* Specific book name */
    chapter: null,      /* Specific absolute chapter */
    refCount: null,     /* Specific range of references */
    crossBook: false    /* Only show cross-book contradictions */
};

function getAbsoluteChapter(verse) {
    var parts = /^(\d?\s?[a-z]+)[\s.:]*(\d*):?(\d*)[-]?(\d*)/i.exec(verse);
    //console.log(parts);

    var chapter = bookToChapter[parts[1]]
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

                    if (match && match[1] == contraFilters.book) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }

            return true;
        }),
        // Key function to compare values on insert/update/remove
        function (d) {
            return d.desc;
        });

    chart.enter().append('path')
        .attr('class', 'arc')
        .attr('d', function(d) {
            var path = '';

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
                        path += 'M ' + start + ',399 A ' + r + ',' + ry + ' 0 0,1 ' + end + ',399 '
                    }
                }
            }

            return path;
        })
        .on('click', function (d) {
            window.location = 'http://www.skepticsannotatedbible.com/contra/' + d.url
        })
        .on('mouseover', function (d) {
            d3.select('#contradictions-chart')
                .selectAll('.arc')
                .sort(function (a, b) {
                    return (a == d) ? 1 : -1;
                });

            d3.select('#selected')
                .html(d.desc + '<br/><span class="subdued">' + d.refs.join(', ').substr(0, maxLength) + '</span>');
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
            
    if (contraFilters.book != null) {
        d3.select('#contradictions-chart')
            .selectAll('.b' + contraFilters.book.replace(/\s+/g, '').toLowerCase())
            .classed('selected', true);
    }
}

function issueBarChart(selector, data) {
    var element = d3.select('#' + selector);

    /*var yScale = d3.scale.linear().range([100, 0]);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('right')
        .tickSize(-1200);

    yScale.domain([0, d3.max(data, function (d) { return d.verseCount; })]);

    element.append('g')
        .attr('transform', 'translate(1175, 0)')
        .attr('class', 'axis')
        .call(yAxis.ticks(4));*/

    element.selectAll('rect')
        .data(data)
        .enter().append('rect')
            .attr('class', function (d, i) {
                return i >= 39 ? 'nt ' + selector : selector
            })
            .attr('x', function (d, i) {
                return bookToChapter[d.name];
            })
            .attr('y', function (d, i) {
                return 98 - (d.relativeCount * 98)
            })
            .attr('width', function (d, i) {
                return Math.max(1, bookToChapterCount[d.name] - 1);
            })
            .attr('height', function (d) {
                return d.relativeCount * 98 + 2
            })
            .on('click', function (d, i) {
                window.location = 'http://www.skepticsannotatedbible.com/' + d.url;
            })
            .on('mouseover', function (d, i) {
                var testament = i >= 39 ? 'New Testament' : 'Old Testament';
                d3.select('#selected')
                    .html(testament + ' - ' + d.name + ' - ' + d.verseCount + ' verses<br/><span class="subdued">' + d.refs.join(', ').substr(0, maxLength) + '</span>');
            });
}

d3.select('#selected').transition().delay(2000).duration(1000).style('opacity', 1.0);

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
                window.location = 'http://www.biblegateway.com/passage/?search=' + d.book + ' ' + chapterNum + '&version=KJV'
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
});

// Pie charts
function createPie(selector, data, colors, text, hovers) {
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
            });

    d3.select(selector + ' g').append('text')
            .attr('dy', '10')
            .style('text-anchor', 'middle')
            .text(text);
}

createPie('#pCreation', [46, 54], ['crimson', 'steelblue'], '46%', [
    'believe in young Earth creationism.',
    'do not believe in young Earth creationism.'
]);
createPie('#pCreationCollege', [25, 75], ['crimson', 'steelblue'], '25%', [
    'of college graduates believe in young Earth creationism.',
    'of college graduates do not believe in young Earth creationism.'
]);
createPie('#pChristian', [51.9, 23.3, 2.1, 22.7], ['crimson', '#E02B50', '#E34363', 'steelblue'], '77%', [
    'are Protestant/Other Christian',
    'are Catholic',
    'are Mormon',
    'are not Christian'
]);
createPie('#pReligious', [40, 29, 31], ['crimson', '#E02B50', 'steelblue'], '69%', [
    'are very religious',
    'are moderately religious',
    'are not religious'
]);
