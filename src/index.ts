
import PolicyRepresentation from './lib/PolicyRepresentation'
import parse, { getAccessKey } from './parse'
import legacyParse from './legacyParse'
import Policy from './lib/Policy'

export {
  parse,
  getAccessKey,
  legacyParse,
  Policy
}

export function sign (accessKey, secret) {
  return new PolicyRepresentation(accessKey, secret)
}
