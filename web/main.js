var selected = null;
var bData = null;
var bookToChapter = {};
var bookToChapterCount = {};
var maxLength = 250;

function getAbsoluteChapter(verse) {
    var parts = /^(\d?\s?[a-z]+)[\s.]*(\d*):?(\d*)-?(\d*)/i.exec(verse);
    //console.log(parts);

    var chapter = bookToChapter[parts[1]]
    chapter = (chapter === undefined) ? bookToChapter[parts[1] + 's'] : chapter;

    return chapter + parseInt(parts[2]);
}

function issueBarChart(selector, data) {
    var element = d3.select('#' + selector);

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
                // TODO: redirect to SAB page
                window.location = 'http://www.skepticsannotatedbible.com/' + d.url;
            })
            .on('mouseover', function (d) {
                d3.select('#selected')
                    .html(d.name + ' - ' + d.verseCount + ' verses<br/><span class="subdued">' + d.refs.join(', ').substr(0, maxLength) + '</span>');
            });
}

d3.select('#selected').transition().delay(2000).duration(1000).style('opacity', 1.0);

d3.json('./kjv.json', function (err, json) {
    bData = json;

    var chapters = [];
    var chapterCount = 0;

    for (var x = 0; x < json.sections.length; x++) {
        for (var y = 0; y < json.sections[x].books.length; y++) {
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
        issueBarChart('misogyny', json);
    });

    d3.json('./science.json', function (err, json) {
        issueBarChart('science', json);
    });

    d3.json('./homosexual.json', function (err, json) {
        issueBarChart('homosexual', json);
    });

    d3.json('./violence.json', function (err, json) {
        issueBarChart('violence', json);
    });

    var svg = d3.select('#contradictions');

    // Draw chapter length bars
    svg.selectAll('rect')
        .data(chapters)
        .enter().append('rect')
            .attr('class', function (d, i) {return d.section == 'New Testament' ? 'nt' : ''})
            .attr('x', function (d, i) {return i;})
            .attr('y', 400)
            .attr('width', 1)
            .attr('height', function (d, i) {return d.chapter.relativeLength * 100;})
            .on('click', function (d) {
                selected = this;
            })
            .on('mouseover', function (d) {
                if (!selected) {
                    d3.select('#selected')
                        .html(d.section + ' - ' + d.book + ' - ' + d.chapter.name + '<br/><span class="subdued">' + d.chapter.wordCount + ' words, ' + d.chapter.charCount + ' characters</span>');
                }
            })
            .on('mouseout', function (d) {

            });

    d3.json('./contra.json', function (err, json) {
        var html = '<tr>';
        for (x = 0; x < json.length; x++) {
            if ((x + 1) % 4 == 0) {
                html += '</tr><tr>'
            }

            html += '<td><a href="http://www.skepticsannotatedbible.com/contra/' + json[x].url + '">' + (x + 1) + ' ' + json[x].desc + '</a></td>';
        }
        html += '</tr>'
        d3.select('#contradictionsTable').html(html);

        svg.selectAll('.arc')
            .data(json)
            .enter().append('path')
                .attr('class', 'arc')
                .attr('d', function(d) {
                    var path = '';

                    if (d.refs.length > 1) {
                        // Only show up to 10 refs, some have over 100...
                        for (x = 0; x < Math.min(10, d.refs.length - 1); x++) {
                            var start = getAbsoluteChapter(d.refs[x]);
                            var end = getAbsoluteChapter(d.refs[x + 1]);

                            if (start > end) {
                                var tmp = end;
                                end = start;
                                start = tmp;
                            }

                            var r = (end - start) * 0.51;
                            var ry = Math.min(r, 490);

                            path += 'M ' + start + ',399 A ' + r + ',' + ry + ' 0 0,1 ' + end + ',399 '
                        }
                    }

                    //console.log(path);

                    return path;
                })
                .on('click', function (d) {
                    window.location = 'http://www.skepticsannotatedbible.com/contra/' + d.url
                })
                .on('mouseover', function (d) {
                    d3.select('#selected')
                        .html(d.desc + '<br/><span class="subdued">' + d.refs.join(', ').substr(0, maxLength) + '</span>');
                });
    });
});
