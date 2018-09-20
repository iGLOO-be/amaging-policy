
import debugFactory from "debug";
import { promisify } from "es6-promisify";
import jwt from "jsonwebtoken";
import { Policy } from "./lib/Policy";

const debug = debugFactory("amaging-policy:parse");
const jwtVerify: (token: string, secret: string) => Promise<IPolicyJWTCOntent> = promisify(jwt.verify.bind(jwt));

interface IPolicyJWTCOntent {
  accessKey?: string;
  data?: object;
}

export default async function parse(secret: string, token: string) {
  debug("Verify policy from JWT", token);
  let decoded;

  try {
    decoded = await jwtVerify(token, secret);
  } catch (err) {
    debug("Got error during verify policy from JWT", err);

    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return false;
    }

    throw err;
  }

  debug("JWT valid with:", decoded);

  return new Policy({
    conditions: Array.isArray(decoded.data) ? decoded.data : [],
  });
}

export function getAccessKey(token: string) {
  let decoded;

  try {
    decoded = jwt.decode(token) as IPolicyJWTCOntent;
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return;
    }
    throw err;
  }

  return (decoded && decoded.accessKey) || undefined;
}
