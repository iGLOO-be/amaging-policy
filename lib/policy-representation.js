
const assert = require('assert')
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
  constructor (date, diffDate, secret) {
    assert(date, 'Options `date` is mandatory.')
    assert(secret, 'Options `secret` is mandatory.')

    this._expiration = utils.offsetDate(date, diffDate)
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

  token () {
    return utils.genToken(this.toBase64(), this._secret)
  }
}

module.exports = PolicyRepresentation
