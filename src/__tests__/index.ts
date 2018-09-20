
import {
  getAccessKey,
  legacyParse,
  parse,
  Policy,
  sign,
} from "..";

describe("Exports", () => {
  it("Exports is correct", () => {
    expect(typeof Policy).toEqual("function");
    expect(typeof getAccessKey).toEqual("function");
    expect(typeof legacyParse).toEqual("function");
    expect(typeof parse).toEqual("function");
    expect(typeof sign).toEqual("function");
  });
});
