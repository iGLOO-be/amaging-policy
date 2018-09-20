
export interface IPolicyErrorData {
  key?: string;
  validator?: string;
}

export class PolicyError extends Error {
  public data: IPolicyErrorData | undefined;
  public type: string;

  constructor(type: string, data?: IPolicyErrorData) {
    super();

    this.type = type;
    this.data = data;
    this.name = "PolicyError";
    switch (this.type) {
      case "INVALID_KEY":
        this.message = `Invalid value for key: ${(data && data.key) || ""}`;
        break;
      case "INVALID_VALIDATOR_NAME":
        this.message = `Invalid policy validator name: ${(data && data.validator) || ""}`;
        break;
    }
  }
}
