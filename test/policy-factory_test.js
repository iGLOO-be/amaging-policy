/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const crypto = require('crypto')
const chai = require('chai')
const moment = require('moment')
const { expect } = chai
const jwt = require('jsonwebtoken')
const PolicyFactory = require('../lib/policy-factory')

const genToken = function (policy, secret) {
  const sign = crypto.createHmac('sha1', secret)
  sign.update(policy)
  return sign.digest('hex').toLowerCase()
}

const encodeBase64 = policy => Buffer.from(policy, 'utf-8').toString('base64')

describe('PolicyFactory', function () {
  it('is a class', () => expect(PolicyFactory).to.be.a('function'))

  it('Cannot be instanciated without a secret', () =>
    expect(() => new PolicyFactory()).throws('The secret is mandatory.')
  )

  it('Can be instanciated with all arguments', () => new PolicyFactory('secret'))

  describe('PolicyFactory:static:getAccessKeyFromJWT', function () {
    it('Return false if policy is not correct', () => {
      expect(PolicyFactory.getAccessKeyFromJWT('boom')).to.equal(undefined)
    })
    it('Return false if jwt is ok but policy is not correct', () => {
      expect(PolicyFactory.getAccessKeyFromJWT(jwt.sign({ baazz: 'access' }, 'secret'))).to.equal(undefined)
    })
    it('Return accessKey', () => {
      expect(PolicyFactory.getAccessKeyFromJWT(jwt.sign({ accessKey: 'access' }, 'secret'))).to.equal('access')
    })
  })

  describe('PolicyFactory::createFromJWT', function () {
    it('Return false if policy is not correct', async function () {
      const policyToken = jwt.sign({}, 'foobar')
      const policy = await new PolicyFactory('secret').createFromJWT(policyToken)
      return expect(policy).to.be.equals(false)
    })

    it('Return false if policy expired', async function () {
      const policyToken = jwt.sign({}, 'foobar', { expiresIn: -1 })
      const policy = await new PolicyFactory('secret').createFromJWT(policyToken)
      return expect(policy).to.be.equals(false)
    })

    it('Return a policy', async function () {
      const policyToken = jwt.sign({
        data: {
          conditions: [
            { foo: 'barrr' }
          ]
        }
      }, 'secret')
      const policy = await new PolicyFactory('secret').createFromJWT(policyToken)
      expect(policy).to.be.instanceOf(require('../lib/policy'))
      expect(policy.get('foo')).to.be.equal('barrr')
    })
  })

  describe('PolicyFactory::create', function () {
    it('Return false if token do not match policy', function () {
      const policyData = JSON.stringify({'expiration': '2007-12-01'})
      const base64Policy = encodeBase64(policyData)
      const hmacSecret = 'bad_secret'
      const token = genToken(base64Policy, hmacSecret)
      const policy =
        new PolicyFactory('secret').create(
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
        new PolicyFactory('secret').create(
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
        new PolicyFactory('secret').create(
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
        new PolicyFactory('secret').create(
          base64Policy,
          token
        )
      return expect(policy).to.be.instanceOf(require('../lib/policy'))
    })
  })

  describe('PolicyFactory::represent', () =>
    it('Return a PolicyRepresentation', function () {
      const policyRepresentation =
        new PolicyFactory('secret', 'access').represent(
          new Date(),
          '1d'
        )
      expect(policyRepresentation).to.be.instanceOf(require('../lib/policy-representation'))
      expect(policyRepresentation._secret).to.equal('secret')
      expect(policyRepresentation._accessKey).to.equal('access')
    })
  )
})
