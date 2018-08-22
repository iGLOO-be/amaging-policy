
const assert = require('assert')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const utils = require('./utils')

const jwtSign = promisify(jwt.sign.bind(jwt))

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
  constructor (date, expiresIn, secret, accessKey) {
    assert(date, 'Options `date` is mandatory.')
    assert(secret, 'Options `secret` is mandatory.')

    this._expiresIn = expiresIn
    this._expiration = utils.offsetDate(date, expiresIn)
    this._conditions = []
    this._data = {}
    this._secret = secret
    this._accessKey = accessKey
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
    assert(this._accessKey, 'Access key is mandatory for create a JWT')

    const payload = {
      accessKey: this._accessKey,
      data: [
        ...Object.keys(this._data).map(key => ({ [key]: this._data[key] })),
        ...this._conditions
      ]
    }

    const jwt = await jwtSign(payload, this._secret, {
      expiresIn: this._expiresIn
    })

    return jwt
  }

  token () {
    return utils.genToken(this.toBase64(), this._secret)
  }
}

module.exports = PolicyRepresentation
