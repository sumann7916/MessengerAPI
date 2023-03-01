
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { User } from '../entity/users.entity';

@Injectable()
@ValidatorConstraint({ name: 'isUnique', async: true })
export class IsEmailUnique implements ValidatorConstraintInterface {
  async validate(email: 'string', args: ValidationArguments) {
    const user = await User.findOne({ where: { email }});
    return !user; 
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} ${args.value} is already taken`;
  }
}
