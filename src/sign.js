
import PolicyRepresentation from './lib/PolicyRepresentation'

export default function sign (accessKey, secret) {
  return new PolicyRepresentation(accessKey, secret)
}
