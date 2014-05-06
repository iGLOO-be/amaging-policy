
crypto = require 'crypto'
chai = require 'chai'
moment = require 'moment'
assert = chai.assert
expect = chai.expect

requireTest = (path) ->
  require((process.env.APP_SRV_COVERAGE || '../') + path)

#########

requirePolicy = -> requireTest './lib/policy'
getPolicy = (args) -> new (requirePolicy())(args)


describe 'Policy', ->
  it 'is a class', ->
    expect(requirePolicy()).to.be.a('function')

  it 'Can be instanciated with all arguments', ->
    getPolicy({})

  it 'Throws an error if policy data do not match policy conditions', ->
    expect(->
      policy = getPolicy({
        conditions: [
          {'foo': 'bar'},
          ['eq', 'foo', 'baz']
        ]
      })
    ).to.throws('Invalid value for key: foo')
    getPolicy({})

  it 'Not throws an error if policy data do not match policy conditions', ->
    policy = getPolicy({
      conditions: [
        {'foo': 'bar'},
        ['eq', 'foo', 'bar']
      ]
    })
    expect(policy.get('foo')).to.be.equals('bar')

  it 'Throws an error if policy data do not match the second policy conditions', ->
    expect(->
      policy = getPolicy({
        conditions: [
          {'foo': 'bar'},
          ['eq', 'foo', 'bar'],
          ['eq', 'foo', 'baz']
        ]
      })
    ).to.throws('Invalid value for key: foo')
    getPolicy({})




  describe 'Policy::set', ->
    it 'Can set a value without validations', ->
      policy = getPolicy({})
      policy.set('foo', 'bar')
      expect(policy.get('foo')).to.be.equals('bar')

    it 'Can set a value with validations', ->
      policy = getPolicy({
        conditions: [
          ['eq', 'foo', 'bar']
        ]
      })
      expect(policy.get('foo')).to.be.undefined
      policy.set('foo', 'bar')
      expect(policy.get('foo')).to.be.equals('bar')

    it 'Throws an error if set a value breaking a validation', ->
      policy = getPolicy({
        conditions: [
          ['eq', 'foo', 'bar']
        ]
      })
      expect(policy.get('foo')).to.be.undefined
      expect(->
        policy.set('foo', 'baz')
      ).to.throws('Invalid value for key: foo')
      expect(policy.get('foo')).to.be.undefined

    it 'Throws an error if set a value breaking the second validation', ->
      policy = getPolicy({
        conditions: [
          ['eq', 'foo', 'bar'],
          ['eq', 'foo', 'baz']
        ]
      })
      expect(policy.get('foo')).to.be.undefined
      expect(->
        policy.set('foo', 'bar')
      ).to.throws('Invalid value for key: foo')
      expect(policy.get('foo')).to.be.undefined

