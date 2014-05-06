{Emitter} = require 'emissary'
dotty = require 'dotty'
_ = require 'lodash'

class Store
  Emitter.includeInto @

  constructor: ->
    @_data = {}
    @_defaults = {}


  setDefaults: (values) ->
    _.extend @_defaults, values


  ##
  # Modifier
  ##
  get: (key) ->
    val = dotty.get(@_data, key)
    if typeof val == 'undefined'
      return dotty.get(@_defaults, key)
    return val

  set: (key, value) ->
    old = @get key
    edited = dotty.put @_data, key, value
    if old != value
      @_update(key, value)
    return edited

  del: (key) ->
    removed = dotty.remove @_data, key
    @_update(key)
    return removed

  toggle: (key) ->
    @set key, !@get(key)


  ##
  # Saver
  ##
  _update: (key, value) ->
    @_save() if @_save
    if key
      @emit "updated.#{key}", value
    else
      @emit 'updated'

module.exports = Store