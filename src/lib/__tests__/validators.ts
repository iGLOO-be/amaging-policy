
import validators from '../validators'

describe('Validators', () => {
  describe('eq', () =>
    it('Must test equality', () => {
      expect(validators.eq('a', 'a')).toEqual(true)
      expect(validators.eq('a', 'b')).toEqual(false)
      expect(validators.eq(undefined, 'a')).toEqual(false)
      expect(validators.eq('a', undefined)).toEqual(false)
      expect(validators.eq(undefined, undefined)).toEqual(true)
      expect(validators.eq(null, null)).toEqual(true)
    })
  )

  describe('starts-with', () =>
    it('Must begin with', () => {
      expect(validators['starts-with']('abc', 'a')).toEqual(true)
      expect(validators['starts-with']('abc', 'b')).toEqual(false)
      expect(validators['starts-with'](undefined, 'b')).toEqual(false)
      expect(validators['starts-with']('b', undefined)).toEqual(false)
      expect(validators['starts-with'](undefined, undefined)).toEqual(false)
      expect(validators['starts-with'](null, null)).toEqual(false)
    })
  )

  describe('ends-with', () =>
    it('Must begin with', () => {
      expect(validators['ends-with']('abc', 'c')).toEqual(true)
      expect(validators['ends-with']('abc', 'b')).toEqual(false)
      expect(validators['ends-with'](undefined, 'b')).toEqual(false)
      expect(validators['ends-with']('b', undefined)).toEqual(false)
      expect(validators['ends-with'](undefined, undefined)).toEqual(false)
      expect(validators['ends-with'](null, null)).toEqual(false)
    })
  )

  describe('regex', () =>
    it('Must match with', () => {
      expect(validators.regex('abc', '[a-b]+')).toEqual(true)
      expect(validators.regex('abc', '[0-9]+')).toEqual(false)
      expect(validators.regex(undefined, '[0-9]+')).toEqual(false)
      expect(validators.regex('abc', undefined)).toEqual(false)
      expect(validators.regex(undefined, undefined)).toEqual(false)
      expect(validators.regex(null, null)).toEqual(false)
    })
  )

  describe('in', () =>
    it('Must be found in array', () => {
      expect(validators.in('abc', ['abc', 'cba'])).toEqual(true)
      expect(validators.in('abc', ['123', 'cba'])).toEqual(false)
      expect(validators.in(undefined, ['123', 'cba'])).toEqual(false)
      expect(validators.in('abc', undefined)).toEqual(false)
      expect(validators.in(undefined, undefined)).toEqual(false)
      expect(validators.in(null, null)).toEqual(false)
    })
  )

  describe('range', () =>
    it('Must be found in array', () => {
      expect(validators.range(0, [0, 2])).toEqual(true)
      expect(validators.range(1, [0, 2])).toEqual(true)
      expect(validators.range(2, [0, 2])).toEqual(true)
      expect(validators.range(3, [0, 2])).toEqual(false)
      expect(validators.range(1.25, [0, 2])).toEqual(true)
    })
  )
})
