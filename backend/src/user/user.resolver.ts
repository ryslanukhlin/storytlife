import { UserService } from './user.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from './currentUser.decorator';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query()
    getCurrentUser(@CurrentUser() currentUser: ICurrentUser) {
        return this.userService.findId(currentUser.id);
    }

    @Query()
    getUser(@Args('userId') userId: string) {
        return this.userService.findId(userId);
    }

    @Query()
    getUsers(@CurrentUser() currentUser: ICurrentUser) {
        return this.userService.getUsers(currentUser.id);
    }
}
