/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const jwt = require('jsonwebtoken')
const chai = require('chai')
const { expect } = chai

const requirePolicyRepresentation = () => require('../lib/policy-representation')
const Policy = requirePolicyRepresentation()

describe('PolicyRepresentation', function () {
  it('is a class', () => expect(requirePolicyRepresentation()).to.be.a('function'))

  it('Cannot be instanciated without a date', () =>
    expect(() => new Policy()).throws('Options `date` is mandatory.')
  )

  it('Cannot be instanciated without a secret', () =>
    expect(() => new Policy(new Date(), '1d')).throws('Options `secret` is mandatory.')
  )

  it('Can be instanciated with all arguments', () => new Policy(new Date(), '1d', 'secret'))

  describe('PolicyRepresentation::conds', () =>
    it('Add a condition', function () {
      const policy = new Policy(new Date(), '1d', 'secret')
      policy.cond('eq', '$key', 'test')

      expect(policy._conditions).to.be.an('array')
      return expect(policy._conditions.length).to.be.equals(1)
    })
  )

  describe('PolicyRepresentation::data', () =>
    it('Add a data', function () {
      const policy = new Policy(new Date(), '1d', 'secret')
      policy.data('foo', 'bar')

      expect(policy._data).to.be.an('object')
      return expect(policy._data.foo).to.be.equals('bar')
    })
  )

  describe('PolicyRepresentation', function () {
    it('toJSON', function () {
      const policy = new Policy(new Date('2014-12-11T16:30:37.725Z'), '1d', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      const json = policy.toJSON()

      expect(json).to.be.an('object')
      expect(json).to.deep.equal({
        expiration: new Date('2014-12-12T16:30:37.725Z'),
        conditions: [
          [ 'eq', '$key', 'test' ],
          {foo: 'bar'}
        ]
      })
    })

    it('toString', function () {
      const policy = new Policy(new Date('2014-12-11T16:30:37.725Z'), '1d', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      const str = policy.toString()

      expect(str).to.equal(
        '{"expiration":"2014-12-12T16:30:37.725Z","conditions":[["eq","$key","test"],{"foo":"bar"}]}'
      )
    })

    it('toBase64', function () {
      const policy = new Policy(new Date('2014-12-11T16:30:37.725Z'), '1d', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      const str = policy.toBase64()

      expect(str).to.equal(
        'eyJleHBpcmF0aW9uIjoiMjAxNC0xMi0xMlQxNjozMDozNy43MjVaIiwiY29uZ' +
        'Gl0aW9ucyI6W1siZXEiLCIka2V5IiwidGVzdCJdLHsiZm9vIjoiYmFyIn1dfQ=='
      )
    })

    it('toJWT', async function () {
      const policy = new Policy(new Date('2014-12-11T16:30:37.725Z'), '1d', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      const str = await policy.toJWT()

      const decoded = jwt.decode(str, 'secret')
      expect(decoded.data).to.deep.equal([
        {
          'foo': 'bar'
        },
        [
          'eq',
          '$key',
          'test'
        ]
      ])
    })
  })
})
