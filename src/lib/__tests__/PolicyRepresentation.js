
import jwt from 'jsonwebtoken'
import PolicyRepresentation from '../PolicyRepresentation'

describe('PolicyRepresentation', () => {
  it('Cannot be instanciated without a date', () => {
    expect(() => new PolicyRepresentation()).toThrow('Options `accessKey` is mandatory.')
  })

  it('Cannot be instanciated without a secret', () => {
    expect(() => new PolicyRepresentation('accessKey')).toThrow('Options `secret` is mandatory.')
  })

  it('Can be instanciated with all arguments', () => {
    const policyRepresentation = new PolicyRepresentation(new Date(), '1d', 'secret')
    expect(policyRepresentation).toBeTruthy()
  })

  describe('PolicyRepresentation.prototype.conds', () => {
    it('Add a condition', () => {
      const policy = new PolicyRepresentation('accessKey', 'secret')
      policy.cond('eq', '$key', 'test')
      expect(policy._conditions).toEqual([
        ['eq', '$key', 'test']
      ])
    })
    it('Add a condition with multiple arguments', () => {
      const policy = new PolicyRepresentation('accessKey', 'secret')
      policy.cond('range', 'Content-Length', 0, 100)
      expect(policy._conditions).toEqual([
        ['range', 'Content-Length', 0, 100]
      ])
    })
    it('Add multiple conditions', () => {
      const policy = new PolicyRepresentation('accessKey', 'secret')
      policy.cond([
        ['eq', '$key', 'test'],
        ['eq', 'action', 'bar']
      ])
      expect(policy._conditions).toEqual([
        ['eq', '$key', 'test'],
        ['eq', 'action', 'bar']
      ])
    })
  })

  describe('PolicyRepresentation.prototype.data', () => {
    it('Add a data', () => {
      const policy = new PolicyRepresentation(new Date(), '1d', 'secret')
      policy.data('foo', 'bar')
      expect(policy._data).toEqual({
        foo: 'bar'
      })
    })
    it('Add multiple data', () => {
      const policy = new PolicyRepresentation(new Date(), '1d', 'secret')
      policy.data({
        'foo': 'bar',
        'baz': 'buz'
      })
      expect(policy._data).toEqual({
        foo: 'bar',
        baz: 'buz'
      })
    })
  })

  describe('PolicyRepresentation.prototype.toJWT', () => {
    it('Return a correct JWT', async () => {
      const policy = new PolicyRepresentation('access', 'secret')
      policy.data('foo', 'bar')
      policy.cond('eq', '$key', 'test')

      const str = await policy.toJWT()

      const decoded = jwt.decode(str, 'secret')
      expect(decoded.accessKey).toEqual('access')
      expect(decoded.data).toEqual([
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
