
import Store from "dottystore";
import extend from "lodash/extend";
import filter from "lodash/filter";
import isObject from "lodash/isObject";
import toArray from "lodash/toArray";
import validators from "./validators";

/*
  Policy sample:

  { "expiration": "2007-12-01T12:00:00.000Z",
    "conditions": [
      ["starts-with", "$key", "user/eric/"],
      ["range-length", "$key", 10, 50],
      {"success_action_redirect": "http://johnsmith.s3.amazonaws.com/new_post.html"},
    ]
  }

*/

class PolicyError extends Error {
  constructor(type, data) {
    super(...arguments);

    this.type = type;
    this.data = data;
    this.name = "PolicyError";
    this.message = (() => {
      switch (this.type) {
        case "INVALID_KEY":
          return `Invalid value for key: ${this.data.key}`;
        case "INVALID_VALIDATOR_NAME":
          return `Invalid policy validator name: ${this.data.validator}`;
      }
    })();
  }
}

class Condition {
  constructor(key, validatorName, validator, validatorArgs) {
    this.key = key;
    this.validatorName = validatorName;
    this.validator = validator;
    this.validatorArgs = validatorArgs;
  }
  public valid(value) { return this.validator.apply(null, [value].concat(toArray(this.validatorArgs))); }
}

class Policy extends Store {
  public static initClass() {
    this.validators = {};
  }
  public static registerValidators(validators) {
    return (() => {
      const result = [];
      for (const validatorName in validators) {
        result.push(Policy.registerValidator(validatorName, validators[validatorName]));
      }
      return result;
    })();
  }
  public static registerValidator(validatorName, validator) {
    Policy.validators[validatorName] = validator;
  }
  public static getValidator(validatorName) {
    return Policy.validators[validatorName];
  }

  constructor(policy) {
    super(...arguments);

    this._parsePolicy(policy);
  }

  public set(key, value) {
    const conditions = this.getConditionsForKey(key);

    for (const cond of Array.from(conditions || [])) {
      if (!cond.valid(value)) {
        throw new PolicyError("INVALID_KEY", {key});
      }
    }

    return super.set(...arguments);
  }

  public _parsePolicy(policy = {}) {
    let key;
    const data = {};
    const conditions = [];

    for (const pol of Array.from(policy.conditions || [])) {
      if (Array.isArray(pol)) {
        const validatorName = pol[0];
        key = pol[1].replace(/^$/, "");
        const validatorArgs = pol.slice(2);

        const validator = Policy.getValidator(validatorName);
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

    return (() => {
      const result = [];
      for (key in data) {
        result.push(this.set(key, data[key]));
      }
      return result;
    })();
  }

  public getConditionsForKey(key) {
    return filter(this.conditions, {key});
  }
}
Policy.initClass();

Policy.registerValidators(validators);

export default Policy;
