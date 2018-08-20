
const assert = require('assert')
const jwt = require('jsonwebtoken')
const utils = require('./utils')

const genPolicyObject = function (date, cond, data) {
  if (cond == null) { cond = [] }
  if (data == null) { data = {} }
  const policy = {
    expiration: date,
    conditions: cond.concat([])
  }

  for (var key in data) {
    policy.conditions.push({ [key]: data[key] })
  }

  return policy
}

class PolicyRepresentation {
  constructor (date, expiresIn, secret) {
    assert(date, 'Options `date` is mandatory.')
    assert(secret, 'Options `secret` is mandatory.')

    this._expiresIn = expiresIn
    this._expiration = utils.offsetDate(date, expiresIn)
    this._conditions = []
    this._data = {}
    this._secret = secret
  }

  cond (action, key, value) {
    this._conditions.push([ action, key, value ])
    return this
  }

  data (key, value) {
    this._data[key] = value
    return this
  }

  toJSON () {
    return genPolicyObject(this._expiration, this._conditions, this._data)
  }

  toString () {
    return JSON.stringify(this.toJSON())
  }

  toBase64 () {
    return Buffer.from(this.toString(), 'utf-8').toString('base64')
  }

  async toJWT () {
    return new Promise((resolve, reject) => {
      jwt.sign({
        data: [
          ...Object.keys(this._data).map(key => ({ [key]: this._data[key] })),
          ...this._conditions
        ]
      }, this._secret, {
        expiresIn: this._expiresIn
      }, (err, jwt) => {
        if (err) reject(err)
        else resolve(jwt)
      })
    })
  }

  token () {
    return utils.genToken(this.toBase64(), this._secret)
  }
}

module.exports = PolicyRepresentation
