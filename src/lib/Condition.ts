
import { ValidatorFn, ValidatorName } from "./Validators";

export
class Condition {
  public key: string;
  private validatorName: ValidatorName;
  private validator: ValidatorFn;
  private validatorArgs: any;

  constructor(key: string, validatorName: ValidatorName, validator: ValidatorFn, validatorArgs: any[]) {
    this.key = key;
    this.validatorName = validatorName;
    this.validator = validator;
    this.validatorArgs = validatorArgs;
  }

  public valid(value: any) {
    return this.validator(value, ...this.validatorArgs);
  }
}
