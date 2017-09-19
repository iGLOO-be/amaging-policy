/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const chai = require('chai')
const { expect } = chai
chai.should()

describe('Validators', function () {
  const validators = require('../lib/validators')

  describe('eq', () =>
    it('Must test equality', function () {
      expect(validators.eq('a', 'a')).to.be.equals(true)
      expect(validators.eq('a', 'b')).to.be.equals(false)
      expect(validators.eq(undefined, 'a')).to.be.equals(false)
      expect(validators.eq('a', undefined)).to.be.equals(false)
      expect(validators.eq(undefined, undefined)).to.be.equals(true)
      return expect(validators.eq(null, null)).to.be.equals(true)
    })
  )

  describe('starts-with', () =>
    it('Must begin with', function () {
      expect(validators['starts-with']('abc', 'a')).to.be.equals(true)
      expect(validators['starts-with']('abc', 'b')).to.be.equals(false)
      expect(validators['starts-with'](undefined, 'b')).to.be.equals(false)
      expect(validators['starts-with']('b', undefined)).to.be.equals(false)
      expect(validators['starts-with'](undefined, undefined)).to.be.equals(false)
      return expect(validators['starts-with'](null, null)).to.be.equals(false)
    })
  )

  describe('ends-with', () =>
    it('Must begin with', function () {
      expect(validators['ends-with']('abc', 'c')).to.be.equals(true)
      expect(validators['ends-with']('abc', 'b')).to.be.equals(false)
      expect(validators['ends-with'](undefined, 'b')).to.be.equals(false)
      expect(validators['ends-with']('b', undefined)).to.be.equals(false)
      expect(validators['ends-with'](undefined, undefined)).to.be.equals(false)
      return expect(validators['ends-with'](null, null)).to.be.equals(false)
    })
  )

  describe('regex', () =>
    it('Must match with', function () {
      expect(validators.regex('abc', '[a-b]+')).to.be.equals(true)
      expect(validators.regex('abc', '[0-9]+')).to.be.equals(false)
      expect(validators.regex(undefined, '[0-9]+')).to.be.equals(false)
      expect(validators.regex('abc', undefined)).to.be.equals(false)
      expect(validators.regex(undefined, undefined)).to.be.equals(false)
      return expect(validators.regex(null, null)).to.be.equals(false)
    })
  )

  describe('in', () =>
    it('Must be found in array', function () {
      expect(validators.in('abc', ['abc', 'cba'])).to.be.equals(true)
      expect(validators.in('abc', ['123', 'cba'])).to.be.equals(false)
      expect(validators.in(undefined, ['123', 'cba'])).to.be.equals(false)
      expect(validators.in('abc', undefined)).to.be.equals(false)
      expect(validators.in(undefined, undefined)).to.be.equals(false)
      return expect(validators.in(null, null)).to.be.equals(false)
    })
  )
})
