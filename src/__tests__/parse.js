
import sign from '../sign'
import parse, { getAccessKey } from '../parse'

import Policy from '../lib/Policy'

describe('parse', () => {
  it('Should correctly parse a policy', async () => {
    const jwt = await sign('key', 'secret').toJWT()

    const policy = await parse('secret', jwt)
    expect(policy).toBeInstanceOf(Policy)
  })
})

describe('getAccessKey', () => {
  it('Should get access key from JWT', async () => {
    const jwt = await sign('key', 'secret').toJWT()
    const accesKey = getAccessKey(jwt)

    expect(accesKey).toEqual('key')
  })
})
