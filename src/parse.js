
import jwt from 'jsonwebtoken'
import Policy from './lib/Policy'
import debugFactory from 'debug'
import { promisify } from 'util'

const debug = debugFactory('amaging-policy:parse')
const jwtVerify = promisify(jwt.verify.bind(jwt))

export default async function parse (secret, token) {
  debug('Verify policy from JWT', token)
  let decoded

  try {
    decoded = await jwtVerify(token, secret)
  } catch (err) {
    debug('Got error during verify policy from JWT', err)

    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return false
    }

    throw err
  }

  debug('JWT valid with:', decoded)

  return new Policy(decoded.data)
}

export function getAccessKey (token) {
  let decoded

  try {
    decoded = jwt.decode(token)
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return
    }
    throw err
  }

  return (decoded && decoded.accessKey) || undefined
}
