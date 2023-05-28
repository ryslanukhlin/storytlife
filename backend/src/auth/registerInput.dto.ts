import { IsString, Length, MaxLength, MinLength } from 'class-validator';
import { UniqueUserField } from 'src/decorator/uniqueUserField.decorator';
import { RegisterInput } from 'src/types/graphql';

export class RegisterInputDto extends RegisterInput {
    @IsString({ message: 'В имени должна быть хотябы одна буква' })
    @Length(3, 20, { message: 'Длина имени должна быть в диапозоне от 3 до 20 символов' })
    name: string;

    @IsString({ message: 'В фамилии должна быть хотябы одна буква' })
    @Length(3, 20, { message: 'Длина фамилии должна быть в диапозоне от 3 до 20 символов' })
    surname: string;

    patronymic?: string;

    @IsString({ message: 'В логине должна быть хотябы одна буква' })
    @Length(3, 20, { message: 'Длина логина должна быть в диапозоне от 3 до 20 символов' })
    login: string;

    @IsString({ message: 'Неверный формат' })
    @Length(18, 18, { message: 'Номер не заполнен но конца' })
    @UniqueUserField({ message: 'С таким номером уже зарегистрировались' })
    phone: string;

    @IsString({ message: 'В пароле должна быть хотябы одна буква' })
    @Length(6, 20, { message: 'Длина пароля должна быть в диапозоне от 6 до 20 символов' })
    password: string;
}
