
import assert from "assert";
import crypto from "crypto";
import debugFactory from "debug";
import moment from "moment";
import { IPolicyObject, Policy } from "./lib/Policy";

const debug = debugFactory("amaging-policy:legacyParse");

const utils = {
  genToken(str: string, secret: string) {
    const sign = crypto.createHmac("sha1", secret);
    sign.update(str);
    return sign.digest("hex").toLowerCase();
  },

  parseJSON(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  },

  decodeBase64(str: string) {
    return Buffer.from(str, "base64").toString();
  },
};

interface ILegacyPolicyObject extends IPolicyObject {
  expiration?: number;
}

export default function legacyParse(secret: string, policy: string, token: string) {
  assert(policy, "The policy is mandatory.");
  assert(token, "The token is mandatory.");

  debug("Create new token with policy:", policy);
  const newToken = utils.genToken(policy, secret);

  debug(`Incoming token: ${token}`);
  debug(`Generated token: ${newToken}`);

  if (newToken !== token) {
    debug("Abort policy creation due to invalid token");
    return false;
  }

  policy = utils.decodeBase64(policy);
  const decodedPolicy = utils.parseJSON(policy) as ILegacyPolicyObject;

  if (!decodedPolicy) {
    debug("Abort policy creation due to invalid policy");
    return false;
  }

  if (!decodedPolicy.expiration || (moment().diff(decodedPolicy.expiration) > 0)) {
    debug("Abort policy creation due to expired policy");
    return false;
  }

  return new Policy(decodedPolicy);
}
