
const assert = require('assert')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const utils = require('./utils')
const Policy = require('./policy')
const debug = require('debug')('amaging:policyFactory')

const PolicyRepresentation = require('./policy-representation')

// Register default validators
// require './validators'

class PolicyFactory {
  constructor (_secret) {
    this._secret = _secret
    debug('Instiate PolicyFactory with secret:', this._secret)
    assert(this._secret, 'The secret is mandatory.')
  }

  represent (date, offset) {
    return new PolicyRepresentation(date, offset, this._secret)
  }

  async createFromJWT (policy) {
    debug('Verify policy from JWT', policy)
    let decoded

    try {
      decoded = await new Promise((resolve, reject) => {
        jwt.verify(policy, this._secret, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
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
