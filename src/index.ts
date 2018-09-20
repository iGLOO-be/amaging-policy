
import legacyParse from "./legacyParse";
import { Policy } from "./lib/Policy";
import { PolicyRepresentation } from "./lib/PolicyRepresentation";
import parse, { getAccessKey } from "./parse";

export {
  parse,
  getAccessKey,
  legacyParse,
  Policy,
};

export function sign(accessKey: string, secret: string) {
  return new PolicyRepresentation(accessKey, secret);
}
