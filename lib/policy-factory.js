
const assert = require('assert')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const utils = require('./utils')
const Policy = require('./policy')
const debug = require('debug')('amaging:policyFactory')
const { promisify } = require('util')

const PolicyRepresentation = require('./policy-representation')

const jwtVerify = promisify(jwt.verify.bind(jwt))

// Register default validators
// require './validators'

class PolicyFactory {
  static getAccessKeyFromJWT (token) {
    let decoded

    try {
      decoded = jwt.decode(token)
    } catch (err) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        return
      }
      throw err
    }

    return (decoded && decoded.accessKey) || undefined
  }

  constructor (_secret, _accessKey) {
    this._secret = _secret
    this._accessKey = _accessKey
    debug('Instiate PolicyFactory with secret:', this._secret)
    assert(this._secret, 'The secret is mandatory.')
  }

  represent (date, offset) {
    return new PolicyRepresentation(date, offset, this._secret, this._accessKey)
  }

  async createFromJWT (token) {
    debug('Verify policy from JWT', token)
    let decoded

    try {
      decoded = await jwtVerify(token, this._secret)
    } catch (err) {
      debug('Got error during verify policy from JWT', err)

      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        return false
      }

      throw err
    }

    debug('JWT valid with:', decoded)

    return new Policy(decoded.data)
  }

  create (policy, token) {
    assert(policy, 'The policy is mandatory.')
    assert(token, 'The token is mandatory.')

    debug('Create new token with policy:', policy)
    const newToken = utils.genToken(policy, this._secret)

    debug(`Incoming token: ${token}`)
    debug(`Generated token: ${newToken}`)

    if (newToken !== token) {
      debug('Abort policy creation due to invalid token')
      return false
    }

    policy = utils.decodeBase64(policy)

    if (!(policy = utils.parseJSON(policy))) {
      debug('Abort policy creation due to invalid policy')
      return false
    }

    if (!policy.expiration || (moment().diff(policy.expiration) > 0)) {
      debug('Abort policy creation due to expired policy')
      return false
    }

    return new Policy(policy)
  }
}

module.exports = PolicyFactory
