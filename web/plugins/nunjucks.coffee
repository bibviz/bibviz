async = require 'async'
fs = require 'fs'
i18n = require 'i18n'
path = require 'path'

{Environment, FileSystemLoader, Template} = require 'nunjucks'

# Supported locales
locales = ['en', 'de']
languages = [
    'English',
    'Deutsch'
]

# Set up locale path and i18n settings
i18n.configure
    locales: locales
    indent: '  '
    directory: path.join(path.dirname(__dirname), 'locales')

# Translate all translatable content in a blob of text, passing
# it through `i18n.__` and using the currently set locale.
translate = (text) ->
    text.replace /\{% trans %\}([^]*?)\{% endtrans %\}/gi, (match, p1) ->
        #console.log "#{p1}: #{i18n.__(p1)}"
        i18n.__(p1)

###
Load and translate Nunjucks templates from the file system.
###
class I18nFileSystemLoader extends FileSystemLoader
    getSource: (name) ->
        #console.log "i18nLoader: Loading #{name} in #{i18n.getLocale()}..."
        source = super(name)

        # Translate the source before it is turned into a
        # Template object further down the processing line.
        source.src = translate source.src

        return source

module.exports = (env, done) ->
    # Expose translation data files to templates
    env.getTransTemplate = (lang) ->
        require "../locales/#{lang}"

    # Expose supported languages and codes to templates
    env.langCodes = locales
    env.langNames = languages

    # Initialize the Nunjucks environment with where to load templates
    nenv = new Environment(new I18nFileSystemLoader env.templatesPath, autoescape: true)

    ###
    Nunjucks template loader. This will load Nunjucks templates from a
    file and provide a way to render them, getting back the text
    content.
    ###
    class NunjucksTemplate extends env.TemplatePlugin
        # Load a template from a file
        @fromFile: (filepath, done) ->
            done null, new this nenv.getTemplate(filepath.relative)

        constructor: (@template) ->

        # Render this template with the given locals
        render: (locals, done) ->
            try
                done null, new Buffer(@template.render(locals))
            catch err
                done err

    ###
    A new template tag to embed markdown templates and have them processed
    as if they were nunjucks templates, processing variables, tags, and
    filters. The nunjucks template is rendered before the markdown is
    converted to HTML, which prevents extra whitespace and other issues.

    This gives you full access to the current context, including
    access to `env`, `page`, `contents`, etc. In practice this winds up
    changing {{ page.html }} into {% md page.markdown %} in templates.
    For example:

    contents/example.md:
        ---
        title: 'Test page!'
        template: example.html
        name: world
        ---
        Hello, {{ page.metadata.name }}!

        {% for item in range(3) %}
         1. Item {{ item + 1 }}
        {% endfor %}

    templates/example.html:
        {% extends layout.html %}

        {% block body %}
            <h1>{{ page.title }}</h1>
            {% md page.markdown %}
        {% endblock %}

    output:
        ...
            <h1>Test page!</h1>
            <p>Hello, world!</p>
            <ol>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ol>
        ...
    ###
    class MdTag
        # The tag name
        tags: ['md']

        # What to do when the tag is encountered
        parse: (parser, nodes, lexer) ->
            tok = parser.nextToken()

            args = parser.parseSignature null, true
            parser.advanceAfterBlockEnd tok.value

            return new nodes.CallExtension this, 'run', args

        # Render the template and return the result
        run: (context, templateStr) ->
            # Translate the template
            templateStr = translate(templateStr)

            # Get the current context variables
            locals = context.getVariables()

            # Load and render the template from the markdown
            tmpl = new Template templateStr, nenv, locals.page.filepath.full
            rendered = tmpl.render locals

            # Set the new markdown content and render to HTML
            locals.page.markdown = rendered
            return locals.page.getHtml()

    nenv.addExtension 'MdTag', new MdTag()

    env.registerTemplatePlugin("**/*.*(html)", NunjucksTemplate);

    ###
    A view that loads and renders translated templates from a page.
    It ignores any preloaded or cached templates and generates full
    translated pages on the fly as needed.

    Caching of translated page components could be possible in the
    future.
    ###
    i18nTemplateView = (env, locals, contents, templates, callback) ->
        if @template is 'none' then return callback(null, null)

        # Disable cached templates because it could result in partials
        # in the wrong language... this means we are doing a bunch of
        # extra work, but I'm not sure how to easily fix this!
        nenv.cache = {}

        # Load i18n version of the template, ignoring any preloaded
        # templates in `templates` because we need to generate the
        # entire document from scratch in a particular language.
        name = @template
        lang = 'en'
        match = /(.*\.html)-(.*)/i.exec name
        if match
            name = match[1]
            lang = match[2]

        #console.log "i18nView: Setting lang to #{lang}"
        i18n.setLocale(lang)

        #console.log "i18nView: Loading #{name} in lang #{lang} for #{@template}!"

        template = new NunjucksTemplate nenv.getTemplate(name)

        # Expose normal template variables, plus i18n functions
        ctx = {env, page: this, contents, lang, i18n, _: i18n.__}
        env.utils.extend ctx, locals

        #console.log "i18nView: rendering #{@template}"
        template.render ctx, callback

    env.registerView 'template', i18nTemplateView

    ###
    Generate MarkdownPage instances with updated filename and
    template values for all supported languages. Pages are stored
    in the same location but have a new name, like page-de.html.
    ###
    env.registerGenerator 'trans', (contents, done) ->
        # Find the Markdown page plugin - this is pretty hacky
        MarkdownPage = null
        for plugin in env.contentPlugins
            if plugin.group is 'pages'
                MarkdownPage = plugin.class
                break

        rv = {}

        # Generate pages in each available language. This generates
        # Markdown pages like normal, but modifies the output filename
        # and the template name to include a language code.
        genLangPages = (lang, done) ->
            # Only translate pages which have translated: true in their metadata
            pages = []
            for page in contents._.pages
                if page.metadata.translated
                    console.log page
                    pages.push page.filepath

            genLangPage = (filepath, done) ->
                name = filepath.relative
                page = MarkdownPage.fromFile full: filepath.full, (err, page) ->
                    page.metadata.filename = "#{env.utils.stripExtension(name)}-#{lang}.html"
                    page.metadata.template = "#{page.metadata.template}-de"
                    rv["#{name}-#{lang}"] = page

                    done(err)

            async.each pages, genLangPage, (err) ->
                done(err)

        # Process each language, ignoring English as it's the default
        async.each locales.filter((x) -> x isnt 'en'), genLangPages, (err) ->
            done(err, rv)

    done()
