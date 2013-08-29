{Environment, FileSystemLoader, Template} = require 'nunjucks'

module.exports = (env, done) ->
    # Initialize the Nunjucks environment with where to load templates
    nenv = new Environment(new FileSystemLoader env.templatesPath, autoescape: true)

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
            # Get the current context variables
            locals = context.getVariables()

            # Load and render the template from the markdown
            tmpl = new Template(templateStr)
            rendered = tmpl.render locals

            # Set the new markdown content and render to HTML
            locals.page.markdown = rendered
            return locals.page.getHtml()

    nenv.addExtension 'MdTag', new MdTag()

    env.registerTemplatePlugin("**/*.*(html)", NunjucksTemplate);

    done()
