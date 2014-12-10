
assert = require 'assert'
utils = require './utils'

genPolicyObject = (date, cond = [], data = {}) ->
  policy =
    expiration: date
    conditions: cond.concat []

  for key, val of data
    policy.conditions.push do ->
      d = {}
      d[key] = val
      return d

  return policy

class PolicyRepresentation
  constructor: (date, diffDate, secret) ->
    assert(date, 'Options `date` is mandatory.')
    assert(secret, 'Options `secret` is mandatory.')

    @_expiration = utils.offsetDate(date, diffDate)
    @_conditions = []
    @_data = {}
    @_secret = secret

  cond: (action, key, value) ->
    @_conditions.push [ action, key, value ]
    return @

  data: (key, value) ->
    @_data[key] = value
    return @

  toJSON: ->
    return genPolicyObject(@_expiration, @_conditions, @_data)

  toString: ->
    return JSON.stringify(@toJSON())

  toBase64: ->
    return Buffer(@toString(), "utf-8").toString("base64")

  token: ->
    return utils.genToken @toBase64(), @_secret

module.exports = PolicyRepresentation