import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '@prisma/client';

@Injectable()
@ValidatorConstraint()
export class UniqueFieldUser implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {}

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return !(await this.userService.findOneField(
            value,
            validationArguments.property as keyof User,
        ));
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return validationArguments.property + ' is register';
    }
}
