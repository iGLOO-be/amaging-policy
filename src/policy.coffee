
assert = require 'assert'
utils = require './fixtures/utils'

class Policy
  constructor: (policy, token, secret) ->
    assert(policy, 'The policy is mandatory.')
    assert(token, 'The token is mandatory.')
    assert(secret, 'The secret is mandatory.')

    @_policyStr = policy
    @_tokenHex = token
    @_secret = secret

  isValid: ->
    newToken = utils.genToken(@_policyStr, @_secret)

    unless newToken == @_tokenHex
      return false

    @_policy = utils.decodeBase64(@_policyStr)

    unless @_policy = utils.parseJSON(@_policy)
      return false

    # check validity



  get: (key, value) ->



  set: (key) ->


module.exports = Policy
