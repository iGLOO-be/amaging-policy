
import assert from "assert";
import { promisify } from "es6-promisify";
import jwt from "jsonwebtoken";

const jwtSign = promisify(jwt.sign.bind(jwt));

export default class PolicyRepresentation {
  constructor(accessKey, secret) {
    assert(accessKey, "Options `accessKey` is mandatory.");
    assert(secret, "Options `secret` is mandatory.");

    this._expiresIn = "20m";
    this._conditions = [];
    this._data = {};
    this._accessKey = accessKey;
    this._secret = secret;
  }

  public expiresIn(_expiresIn) {
    this._expiresIn = _expiresIn;
    return this;
  }

  public cond(action, key, ...value) {
    if (Array.isArray(action)) {
      action.forEach((v) => this.cond(...v));
    } else {
      this._conditions.push([ action, key, ...value ]);
    }
    return this;
  }

  public data(key, value) {
    if (typeof key === "object") {
      Object.assign(this._data, key);
    } else {
      this._data[key] = value;
    }
    return this;
  }

  public async toJWT() {
    const payload = {
      accessKey: this._accessKey,
      data: [
        ...Object.keys(this._data).map((key) => ({ [key]: this._data[key] })),
        ...this._conditions,
      ],
    };

    const jwt = await jwtSign(payload, this._secret, {
      expiresIn: this._expiresIn,
    });

    return jwt;
  }
}
