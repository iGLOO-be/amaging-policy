
import parse, { getAccessKey } from "../parse";
import sign from "../sign";

import { Policy } from "../lib/Policy";

describe("parse", () => {
  it("Should correctly parse a policy", async () => {
    const jwt = await sign("key", "secret")
      .cond("eq", "key", "test")
      .toJWT();

    const policy = await parse("secret", jwt);
    if (!policy) {
      throw new Error("Unable to parse policy");
    }

    expect(policy).toBeInstanceOf(Policy);

    expect(policy.conditions).toMatchSnapshot();

    policy.set("key", "test");

    expect(() => {
      policy.set("key", "bar");
    }).toThrow("Invalid value for key: key");
  });
  it("Should results false if invalid token", async () => {
    expect(await parse("secret", "boom")).toEqual(false);
  });
  it("Should results false if expired token", async () => {
    const jwt = await sign("key", "secret").expiresIn(-1).toJWT();
    expect(await parse("secret", jwt)).toEqual(false);
  });
  it("Should results false if invalid secret", async () => {
    const jwt = await sign("key", "secret").toJWT();
    expect(await parse("bar", jwt)).toEqual(false);
  });
});

describe("getAccessKey", () => {
  it("Should get access key from JWT", async () => {
    const jwt = await sign("key", "secret").toJWT();
    const accesKey = getAccessKey(jwt);

    expect(accesKey).toEqual("key");
  });
});
