
assert = require 'assert'
moment = require 'moment'
utils = require './utils'
Policy = require './policy'
debug = require('debug')('amaging:policyFactory')

# Register default validators
# require './validators'

class PolicyFactory
  constructor: (@_secret) ->
    debug('Instiate PolicyFactory with secret:', @_secret)
    assert(@_secret, 'The secret is mandatory.')

  create: (policy, token) ->
    assert(policy, 'The policy is mandatory.')
    assert(token, 'The token is mandatory.')

    debug('Create new token with policy:', policy)
    newToken = utils.genToken(policy, @_secret)

    debug('Incoming token: ' + token)
    debug('Generated token: ' + newToken)

    unless newToken == token
      debug('Abort policy creation due to invalid token')
      return false

    policy = utils.decodeBase64(policy)

    unless policy = utils.parseJSON(policy)
      debug('Abort policy creation due to invalid policy')
      return false

    if not policy.expiration or moment().diff(policy.expiration) > 0
      debug('Abort policy creation due to expired policy')
      return false

    return new Policy(policy)

module.exports = PolicyFactory
