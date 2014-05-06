
crypto = require 'crypto'
chai = require 'chai'
assert = chai.assert
expect = chai.expect


genToken = (policy, secret) ->
  sign = crypto.createHmac('sha1', secret)
  sign.update(policy)
  return sign.digest('hex').toLowerCase()

encodeBase64 = (policy) ->
  return Buffer(policy, "utf-8").toString("base64")

requireTest = (path) ->
  require((process.env.APP_SRV_COVERAGE || '../') + path)

requirePolicy = -> requireTest('lib/policy')
getPolicy = (policy, token, secret) -> new (requirePolicy())(policy, token, secret)

describe 'Policy', ->
  it 'is a class', ->
    expect(requirePolicy()).to.be.a('function')

  it 'Cannot be instanciated without policy, token and secret', ->
    expect(->
      getPolicy()
    ).throws('The policy is mandatory.')
    expect(->
      getPolicy({})
    ).throws('The token is mandatory.')
    expect(->
      getPolicy({}, 'token')
    ).throws('The secret is mandatory.')

  it 'Can be instanciated with all arguments', ->
    getPolicy({policy: true}, 'token', 'secret')


describe 'Policy::isValid', ->
  it 'Return false if token do not match policy', ->
    policyData = JSON.stringify({"expiration": "2007-12-01"})
    base64Policy = encodeBase64(policyData)
    hmacSecret = 'bad_secret'
    token = genToken(base64Policy, hmacSecret)
    policy =
      getPolicy(
        base64Policy,
        token,
        'secret'
      ).isValid()
    expect(policy).to.be.equals(false)

  it 'Return false if policy is not a valid JSON', ->
    policyData = 'expiration 2007-12-01'
    base64Policy = encodeBase64(policyData)
    hmacSecret = 'secret'
    token = genToken(base64Policy, hmacSecret)
    policy =
      getPolicy(
        base64Policy,
        token,
        hmacSecret
      ).isValid()
    expect(policy).to.be.equals(false)

  # it 'Return false if expired', ->
  #   # todo()

