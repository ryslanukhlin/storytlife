import { UserService } from './user.service';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from './currentUser.decorator';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query()
    getUser(@CurrentUser() currentUser: ICurrentUser) {
        return this.userService.findId(currentUser.id);
    }

    @Query()
    getUsers(@CurrentUser() currentUser: ICurrentUser) {
        return this.userService.getUsers(currentUser.id);
    }
}
