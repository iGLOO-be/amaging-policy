
crypto = require 'crypto'
chai = require 'chai'
moment = require 'moment'
assert = chai.assert
expect = chai.expect

requireTest = (path) ->
  require((process.env.APP_SRV_COVERAGE || '../') + path)

#########

requirePolicyRepresentation = -> requireTest('lib/policy-representation')
Policy = requirePolicyRepresentation()

describe 'PolicyRepresentation', ->
  it 'is a class', ->
    expect(requirePolicyRepresentation()).to.be.a('function')

  it 'Cannot be instanciated without a date', ->
    expect(->
      new Policy()
    ).throws('Options `date` is mandatory.')

  it 'Cannot be instanciated without a secret', ->
    expect(->
      new Policy(new Date(), '1d')
    ).throws('Options `secret` is mandatory.')

  it 'Can be instanciated with all arguments', ->
    new Policy(new Date(), '1d', 'secret')


  describe 'PolicyRepresentation::conds', ->
    it 'Add a condition', ->
      policy = new Policy(new Date(), '1d', 'secret')
      policy.cond('eq', '$key', 'test')

      expect(policy._conditions).to.be.an('array')
      expect(policy._conditions.length).to.be.equals(1)

  describe 'PolicyRepresentation::data', ->
    it 'Add a data', ->
      policy = new Policy(new Date(), '1d', 'secret')
      policy.data('foo', 'bar')

      expect(policy._data).to.be.an('object')
      expect(policy._data.foo).to.be.equals('bar')

  describe 'PolicyRepresentation', ->
    it 'toJSON', ->
      policy = new Policy(new Date('2014-12-11T16:30:37.725Z'), '1d', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      json = policy.toJSON()

      expect(json).to.be.an('object')
      expect(json).to.deep.equal(
        expiration: new Date('2014-12-12T16:30:37.725Z')
        conditions: [
          [ 'eq', '$key', 'test' ],
          foo: 'bar'
        ]
      )

    it 'toString', ->
      policy = new Policy(new Date('2014-12-11T16:30:37.725Z'), '1d', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      str = policy.toString()

      expect(str).to.equal(
        '{"expiration":"2014-12-12T16:30:37.725Z","conditions":[["eq","$key","test"],{"foo":"bar"}]}'
      )

    it 'toBase64', ->
      policy = new Policy(new Date('2014-12-11T16:30:37.725Z'), '1d', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      str = policy.toBase64()

      expect(str).to.equal(
        'eyJleHBpcmF0aW9uIjoiMjAxNC0xMi0xMlQxNjozMDozNy43MjVaIiwiY29uZ' +
        'Gl0aW9ucyI6W1siZXEiLCIka2V5IiwidGVzdCJdLHsiZm9vIjoiYmFyIn1dfQ=='
      )

