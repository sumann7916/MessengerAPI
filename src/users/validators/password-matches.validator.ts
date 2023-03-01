import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@Injectable()
@ValidatorConstraint({ name: 'passwordMatches', async: false })
export class PasswordMatches implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const password = args.object[ args.constraints[0] ];
    return password === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password confirmation does not match.';
  }
}