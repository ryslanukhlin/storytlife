import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginInput } from './../types/graphql';
import { UserService } from './../user/user.service';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RegisterInputDto } from './registerInput.dto';
import { Public } from 'src/decorator/public.decorator';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Public()
    @Mutation()
    @UseGuards(LocalAuthGuard)
    async loginUser(@Args('loginInput') loginInput: LoginInput, @Context() context) {
        return await this.authService.login(context.user);
    }

    @Public()
    @Mutation()
    async registerUser(@Args('registerInput') registerInput: RegisterInputDto) {
        return await this.userService.createUser(registerInput);
    }
}
