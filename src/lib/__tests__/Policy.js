
import Policy from '../Policy'

describe('Policy', () => {
  it('Can be instanciated with all arguments', () => {
    const policy = new Policy()
    expect(policy).toBeTruthy()
  })

  it('Throws an error if policy data do not match policy conditions', function () {
    expect(function () {
      const policy = new Policy({
        conditions: [
          {'foo': 'bar'},
          ['eq', 'foo', 'baz']
        ]
      })
      console.log(policy)
    }).toThrow('Invalid value for key: foo')
  })

  it('Not throws an error if policy data do not match policy conditions', function () {
    const policy = new Policy({
      conditions: [
        {'foo': 'bar'},
        ['eq', 'foo', 'bar']
      ]
    })
    expect(policy.get('foo')).toEqual('bar')
  })

  it('Throws an error if policy data do not match the second policy conditions', function () {
    expect(function () {
      const policy = new Policy({
        conditions: [
          {'foo': 'bar'},
          ['eq', 'foo', 'bar'],
          ['eq', 'foo', 'baz']
        ]
      })
      console.log(policy)
    }).toThrow('Invalid value for key: foo')
  })

  describe('Policy::set', function () {
    it('Can set a value without validations', function () {
      const policy = new Policy()
      policy.set('foo', 'bar')
      expect(policy.get('foo')).toEqual('bar')
    })

    it('Can set a value with validations', function () {
      const policy = new Policy({
        conditions: [
          ['eq', 'foo', 'bar']
        ]
      })
      expect(policy.get('foo')).toEqual(undefined)
      policy.set('foo', 'bar')
      expect(policy.get('foo')).toEqual('bar')
    })

    it('Throws an error if set a value breaking a validation', function () {
      const policy = new Policy({
        conditions: [
          ['eq', 'foo', 'bar']
        ]
      })
      expect(policy.get('foo')).toEqual(undefined)
      expect(() => policy.set('foo', 'baz')).toThrow('Invalid value for key: foo')
      expect(policy.get('foo')).toEqual(undefined)
    })

    it('Throws an error if set a value breaking the second validation', function () {
      const policy = new Policy({
        conditions: [
          ['eq', 'foo', 'bar'],
          ['eq', 'foo', 'baz']
        ]
      })
      expect(policy.get('foo')).toEqual(undefined)
      expect(() => policy.set('foo', 'bar')).toThrow('Invalid value for key: foo')
      expect(policy.get('foo')).toEqual(undefined)
    })
  })

  describe('Policy::getConditionForKey', function () {
    it('Can get conditions for a key', function () {
      const policy = new Policy({
        conditions: [
          ['eq', 'foo', 'bar'],
          ['eq', 'foo', 'baz'],
          ['eq', 'bar', 'baz']
        ]
      })
      expect(policy.getConditionForKey('foo')).toMatchSnapshot()
    })
  })
})
