/* tslint:disable variable-name */

import assert from "assert";
import { promisify } from "es6-promisify";
import jwt from "jsonwebtoken";
import { IPolicyCondition } from "./Policy";
import { ValidatorName } from "./validators";

const jwtSign: (payload: any, secret: string, options: jwt.SignOptions) => Promise<string> =
  promisify(jwt.sign.bind(jwt));

export class PolicyRepresentation {
  public conditions: IPolicyCondition[];
  public _data: any;
  private _expiresIn: number | string;
  private _accessKey: any;
  private _secret: any;

  constructor(accessKey?: string, secret?: string) {
    assert(accessKey, "Options `accessKey` is mandatory.");
    assert(secret, "Options `secret` is mandatory.");

    this.conditions = [];
    this._expiresIn = "20m";
    this._data = {};
    this._accessKey = accessKey;
    this._secret = secret;
  }

  public expiresIn(_expiresIn: string | number) {
    this._expiresIn = _expiresIn;
    return this;
  }

  public cond(action: ValidatorName | IPolicyCondition[], key?: string, ...value: any[]): PolicyRepresentation;
  public cond(conditions: IPolicyCondition[]): PolicyRepresentation;
  public cond(conditions: ValidatorName | IPolicyCondition[], key?: string, ...value: any[]) {
    if (Array.isArray(conditions)) {
      (conditions as IPolicyCondition[]).forEach((condition) => {
        if (Array.isArray(condition)) {
          const action: ValidatorName = condition[0];
          const condKey = condition[1];
          const condValue = condition.slice(2);
          this.cond(action, condKey, ...condValue);
        }
      });
    } else if (typeof key !== "undefined" && Array.isArray(value)) {
      this.conditions.push([ conditions, key, ...value ]);
    }
    return this;
  }

  public data(data: object): PolicyRepresentation;
  public data(data: string, value?: any): PolicyRepresentation;
  public data(data: string | object, value?: any) {
    if (typeof data === "object") {
      Object.assign(this._data, data);
    } else {
      this._data[data] = value;
    }
    return this;
  }

  public async toJWT() {
    const payload = {
      accessKey: this._accessKey,
      data: [
        ...Object.keys(this._data).map((key) => ({ [key]: this._data[key] })),
        ...this.conditions,
      ],
    };

    const jwtToken = await jwtSign(payload, this._secret, {
      expiresIn: this._expiresIn,
    });

    return jwtToken;
  }
}
