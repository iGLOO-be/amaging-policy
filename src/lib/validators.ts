
export default {
  "eq"(value, expected) {
    return value === expected;
  },

  "starts-with"(value, expected) {
    if ((typeof (value != null ? value.substr : undefined) !== "function") || !(expected != null ? expected.length : undefined)) { return false; }
    return value.substr(0, expected.length) === expected;
  },

  "ends-with"(value, expected) {
    if ((typeof (value != null ? value.indexOf : undefined) !== "function") || !(expected != null ? expected.length : undefined)) { return false; }
    return value.indexOf(expected, value.length - expected.length) !== -1;
  },

  "regex"(value, mask) {
    if (!value || !mask) { return false; }
    const regex = new RegExp(mask);
    return regex.test(value);
  },

  "in"(value, possibleValues) {
    return (possibleValues && possibleValues.indexOf && possibleValues.indexOf(value) >= 0) || false;
  },

  "range"(value, [ start, end ]) {
    const v = parseFloat(value);
    return v >= start && v <= end;
  },
};
