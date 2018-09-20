
const validators = {
  "eq"(value?: any, expected?: any): boolean {
    return value === expected;
  },

  "starts-with"(value?: any, expected?: any): boolean {
    if (!(value && typeof value.substr === "function") || !(expected && expected.length >= 0)) {
      return false;
    }
    return value.substr(0, expected.length) === expected;
  },

  "ends-with"(value?: any, expected?: any): boolean {
    if (!(value && typeof value.substr === "function") || !(expected && expected.length >= 0)) {
      return false;
    }
    return value.indexOf(expected, value.length - expected.length) !== -1;
  },

  "regex"(value?: any, mask?: any): boolean {
    if (!value || !mask) { return false; }
    const regex = new RegExp(mask);
    return regex.test(value);
  },

  "in"(value?: any, possibleValues?: any): boolean {
    return (possibleValues && possibleValues.indexOf && possibleValues.indexOf(value) >= 0) || false;
  },

  "range"(value?: any, ranges?: any): boolean {
    if (!ranges || typeof ranges[0] !== "number" || typeof ranges[1] !== "number") {
      return false;
    }
    const v = parseFloat(value);
    return v >= ranges[0] && v <= ranges[1];
  },
};

export type ValidatorFn = (value?: any, ...args: any[]) => boolean;
export type ValidatorName = keyof typeof validators;

export {
  validators,
};
