import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(phone: string, password: string) {
        const user = await this.userService.findOneField(phone, 'phone');
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (user && checkPassword) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = { phone: user.phone, id: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    getToketPayload(token: string) {
        this.jwtService.decode(token);
    }
}
