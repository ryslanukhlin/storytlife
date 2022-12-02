import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): any => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs();
    return request.user ?? request.req.user;
});

export interface ICurrentUser {
    phone: string;
    id: string;
}
