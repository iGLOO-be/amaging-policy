
import { PolicyRepresentation } from "./lib/PolicyRepresentation";

export default function sign(accessKey: string, secret: string) {
  return new PolicyRepresentation(accessKey, secret);
}
