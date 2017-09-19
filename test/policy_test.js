/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const crypto = require('crypto');
const chai = require('chai');
const moment = require('moment');
const { assert } = chai;
const { expect } = chai;

const requirePolicy = () => require('../src/policy');
const getPolicy = args => new (requirePolicy())(args);


describe('Policy', function() {
  it('is a class', () => expect(requirePolicy()).to.be.a('function'));

  it('Can be instanciated with all arguments', () => getPolicy({}));

  it('Throws an error if policy data do not match policy conditions', function() {
    expect(function() {
      let policy;
      return policy = getPolicy({
        conditions: [
          {'foo': 'bar'},
          ['eq', 'foo', 'baz']
        ]
      });
    }).to.throws('Invalid value for key: foo');
    return getPolicy({});
  });

  it('Not throws an error if policy data do not match policy conditions', function() {
    const policy = getPolicy({
      conditions: [
        {'foo': 'bar'},
        ['eq', 'foo', 'bar']
      ]
    });
    return expect(policy.get('foo')).to.be.equals('bar');
  });

  it('Throws an error if policy data do not match the second policy conditions', function() {
    expect(function() {
      let policy;
      return policy = getPolicy({
        conditions: [
          {'foo': 'bar'},
          ['eq', 'foo', 'bar'],
          ['eq', 'foo', 'baz']
        ]
      });
    }).to.throws('Invalid value for key: foo');
    return getPolicy({});
  });

  describe('Policy::set', function() {
    it('Can set a value without validations', function() {
      const policy = getPolicy({});
      policy.set('foo', 'bar');
      return expect(policy.get('foo')).to.be.equals('bar');
    });

    it('Can set a value with validations', function() {
      const policy = getPolicy({
        conditions: [
          ['eq', 'foo', 'bar']
        ]
      });
      expect(policy.get('foo')).to.be.undefined;
      policy.set('foo', 'bar');
      return expect(policy.get('foo')).to.be.equals('bar');
    });

    it('Throws an error if set a value breaking a validation', function() {
      const policy = getPolicy({
        conditions: [
          ['eq', 'foo', 'bar']
        ]
      });
      expect(policy.get('foo')).to.be.undefined;
      expect(() => policy.set('foo', 'baz')).to.throws('Invalid value for key: foo');
      return expect(policy.get('foo')).to.be.undefined;
    });

    return it('Throws an error if set a value breaking the second validation', function() {
      const policy = getPolicy({
        conditions: [
          ['eq', 'foo', 'bar'],
          ['eq', 'foo', 'baz']
        ]
      });
      expect(policy.get('foo')).to.be.undefined;
      expect(() => policy.set('foo', 'bar')).to.throws('Invalid value for key: foo');
      return expect(policy.get('foo')).to.be.undefined;
    });
  });
});

