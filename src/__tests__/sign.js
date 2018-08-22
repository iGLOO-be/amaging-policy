
import sign from '../sign'

describe('sign', () => {
  it('Should correctly sign a policy', async () => {
    const jwt = await sign('key', 'secret')
      .cond('eq', 'key', 'bar')
      .data('some', 'var')
      .toJWT()

    expect(typeof jwt).toEqual('string')
  })
})
