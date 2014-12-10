
crypto = require 'crypto'
chai = require 'chai'
moment = require 'moment'
assert = chai.assert
expect = chai.expect

requireTest = (path) ->
  require((process.env.APP_SRV_COVERAGE || '../') + path)

#########


genToken = (policy, secret) ->
  sign = crypto.createHmac('sha1', secret)
  sign.update(policy)
  return sign.digest('hex').toLowerCase()

encodeBase64 = (policy) ->
  return Buffer(policy, "utf-8").toString("base64")

requirePolicyFactory = -> requireTest('lib/policy-factory')
getPolicyFactory = (policy, token, secret) -> new (requirePolicyFactory())(policy, token, secret)

describe 'PolicyFactory', ->
  it 'is a class', ->
    expect(requirePolicyFactory()).to.be.a('function')

  it 'Cannot be instanciated without a secret', ->
    expect(->
      getPolicyFactory()
    ).throws('The secret is mandatory.')

  it 'Can be instanciated with all arguments', ->
    getPolicyFactory('secret')


  describe 'PolicyFactory::create', ->
    it 'Return false if token do not match policy', ->
      policyData = JSON.stringify({"expiration": "2007-12-01"})
      base64Policy = encodeBase64(policyData)
      hmacSecret = 'bad_secret'
      token = genToken(base64Policy, hmacSecret)
      policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      expect(policy).to.be.equals(false)

    it 'Return false if policy is not a valid JSON', ->
      policyData = 'expiration 2007-12-01'
      base64Policy = encodeBase64(policyData)
      hmacSecret = 'secret'
      token = genToken(base64Policy, hmacSecret)
      policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      expect(policy).to.be.equals(false)

    it 'Return false if policy expired', ->
      policyData = JSON.stringify({"expiration": "2007-12-01T12:00:00.000Z"})
      base64Policy = encodeBase64(policyData)
      hmacSecret = 'secret'
      token = genToken(base64Policy, hmacSecret)
      policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      expect(policy).to.be.equals(false)

    it 'Return a policy', ->
      policyData = JSON.stringify({"expiration": moment().add(15, 'd')})
      base64Policy = encodeBase64(policyData)
      hmacSecret = 'secret'
      token = genToken(base64Policy, hmacSecret)
      policy =
        getPolicyFactory('secret').create(
          base64Policy,
          token
        )
      expect(policy).to.be.instanceOf(requireTest('lib/policy'))
