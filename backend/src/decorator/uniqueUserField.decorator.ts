import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueFieldUser } from 'src/validator/uniqueField.validator';

export function UniqueUserField(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UniqueUserField',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UniqueFieldUser,
        });
    };
}
