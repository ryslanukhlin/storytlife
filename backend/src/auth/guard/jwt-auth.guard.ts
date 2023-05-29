import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        //Если сделать запрос не по graphql то ниже будет ошибка
        if (isPublic) return true;

        //я не нашел способа как использовать jwt для подписок, пока мы его отключим
        //будем передавать userId через параметр
        const isSubscribe = (context.getArgs()[3] as any).parentType.name === 'Subscription';

        if (isSubscribe) return true;

        return super.canActivate(context);
    }
}
