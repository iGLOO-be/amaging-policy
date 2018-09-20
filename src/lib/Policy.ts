
import { Store } from "dottystore";
import extend from "lodash/extend";
import isObject from "lodash/isObject";
import { Condition } from "./Condition";
import { PolicyError } from "./PolicyError";
import { ValidatorName, validators } from "./validators";

/*
  Policy sample:s

  { "expiration": "2007-12-01T12:00:00.000Z",
    "conditions": [
      ["starts-with", "$key", "user/eric/"],
      ["range-length", "$key", 10, 50],
      {"success_action_redirect": "http://johnsmith.s3.amazonaws.com/new_post.html"},
    ]
  }

*/

export interface IPolicyObject {
  conditions?: IPolicyCondition[];
}
export type IPolicyCondition = [ValidatorName, string, ...any[]] | IPolicyData;
interface IPolicyData {
  [key: string]: string;
}

export
class Policy extends Store {
  public conditions: Condition[];

  constructor(policy?: IPolicyObject) {
    super();

    this.conditions = [];
    this._parsePolicy(policy);
  }

  public set(key: string, value: any) {
    const conditions = this.getConditionsForKey(key);

    for (const cond of Array.from(conditions || [])) {
      if (!cond.valid(value)) {
        throw new PolicyError("INVALID_KEY", {key});
      }
    }

    return super.set(key, value);
  }

  public _parsePolicy(policy: IPolicyObject = {}) {
    let key;
    const data: IPolicyData = {};
    const conditions = [];

    for (const pol of Array.from(policy.conditions || [])) {
      if (Array.isArray(pol)) {
        const validatorName = pol[0];
        key = pol[1].replace(/^$/, "");
        const validatorArgs = pol.slice(2);

        const validator = validators[validatorName];
        if (!validator) {
          throw new PolicyError("INVALID_VALIDATOR_NAME", {validator});
        }

        const condition = new Condition(key, validatorName, validator, validatorArgs);
        conditions.push(condition);
      } else if (isObject(pol)) {
        extend(data, pol);
      }
    }

    this.conditions = conditions;

    Object.keys(data).forEach((dataKey) => {
      this.set(dataKey, data[dataKey]);
    });
  }

  public getConditionsForKey(key: string): Condition[] {
    return this.conditions.filter((cond) => cond.key === key);
  }
}
