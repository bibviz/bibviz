###
Pass through filter for .json files in a data directory,
so that these files are just copied to the build directory
and usable as data files for AJAX requests.
###

fs = require 'fs'

module.exports = (env, callback) ->
  # Expose data file info to templates
  env.getFullBible = ->
    require '../contents/data/kjv-full'

  env.getContra = ->
    require '../contents/data/contra'

  # Setup a content handler to pass through JSON data files
  class JsonDataPlugin extends env.ContentPlugin
    constructor: (@filepath, src) ->
      @src = src

    getFilename: ->
      @filepath.relative

    getView: -> (env, locals, contents, templates, callback) ->
      callback null, new Buffer(JSON.stringify(@src))

  JsonDataPlugin.fromFile = (filepath, callback) ->
    env.utils.readJSON filepath.full, (error, result) ->
      if not error?
        plugin = new JsonDataPlugin filepath, result
      callback error, plugin

  env.registerContentPlugin 'json', 'data/**/*.json', JsonDataPlugin
  
  callback()
