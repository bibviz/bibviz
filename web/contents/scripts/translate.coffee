loadLanguageData = (data) ->
    elements = d3.select('#translations')
        .selectAll('.translatableItem')
        .data(Object.keys(data), (d) -> d)

    elements.enter().append('div')
            .attr('class', 'translatableItem')
            .each((d, i) ->
                div = d3.select this
                div.append('textarea')
                    .attr('class', "original")
                    .attr('disabled', true)
                    .text(d)
                div.append('textarea')
                    .attr('class', "translated")
                    .attr('placeholder', d)
                    .text((d) ->
                        if d isnt data[d] then data[d]
                    )
            )

    elements.exit().remove()

d3.json '/data/en.json', (err, data) ->
    if err then return console.log(err)
    loadLanguageData data

d3.select('#loadTranslation')
    .on 'click', ->
        content = JSON.parse d3.select('#generated')[0][0].value
        loadLanguageData content
        event.preventDefault()

d3.select('#generateTranslation')
    .on 'click', ->
        console.debug 'Generating translation...'
        trans = {}

        d3.selectAll('.translatableItem')
            .each ->
                div = d3.select this
                original = div.select('.original')[0][0].value
                translated = div.select('.translated')[0][0].value

                trans[original] = translated

        d3.select('#generated')[0][0].value = JSON.stringify(trans)

        event.preventDefault()
