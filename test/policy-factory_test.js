/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const crypto = require('crypto')
const chai = require('chai')
const moment = require('moment')
const { expect } = chai

const genToken = function (policy, secret) {
  const sign = crypto.createHmac('sha1', secret)
  sign.update(policy)
  return sign.digest('hex').toLowerCase()
}

const encodeBase64 = policy => Buffer.from(policy, 'utf-8').toString('base64')

const requirePolicyFactory = () => require('../lib/policy-factory')
const getPolicyFactory = (policy, token, secret) => new (requirePolicyFactory())(policy, token, secret)

describe('PolicyFactory', function () {
  it('is a class', () => expect(requirePolicyFactory()).to.be.a('function'))

  it('Cannot be instanciated without a secret', () =>
    expect(() => getPolicyFactory()).throws('The secret is mandatory.')
  )

  it('Can be instanciated with all arguments', () => getPolicyFactory('secret'))

  describe('PolicyFactory::create', function () {
    it('Return false if token do not match policy', function () {
      const policyData = JSON.stringify({'expiration': '2007-12-01'})
      const base64Policy = encodeBase64(policyData)
      const hmacSecret = 'bad_secret'
      const token = genToken(base64Policy, hmacSecret)
      const policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      return expect(policy).to.be.equals(false)
    })

    it('Return false if policy is not a valid JSON', function () {
      const policyData = 'expiration 2007-12-01'
      const base64Policy = encodeBase64(policyData)
      const hmacSecret = 'secret'
      const token = genToken(base64Policy, hmacSecret)
      const policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      return expect(policy).to.be.equals(false)
    })

    it('Return false if policy expired', function () {
      const policyData = JSON.stringify({'expiration': '2007-12-01T12:00:00.000Z'})
      const base64Policy = encodeBase64(policyData)
      const hmacSecret = 'secret'
      const token = genToken(base64Policy, hmacSecret)
      const policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      return expect(policy).to.be.equals(false)
    })

    return it('Return a policy', function () {
      const policyData = JSON.stringify({'expiration': moment().add(15, 'd')})
      const base64Policy = encodeBase64(policyData)
      const hmacSecret = 'secret'
      const token = genToken(base64Policy, hmacSecret)
      const policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      return expect(policy).to.be.instanceOf(require('../lib/policy'))
    })
  })

  describe('PolicyFactory::represent', () =>
    it('Return a PolicyRepresentation', function () {
      const policy =
        getPolicyFactory('secret').represent(
          new Date(),
          '1d'
        )
      return expect(policy).to.be.instanceOf(require('../lib/policy-representation'))
    })
  )
})
