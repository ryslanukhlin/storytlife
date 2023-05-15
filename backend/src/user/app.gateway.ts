import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets/interfaces/hooks';
import { UserService } from './user.service';

@WebSocketGateway(4000, {
    cors: {
        origin: '*',
    },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly userService: UserService) {}

    @WebSocketServer()
    server;

    @SubscribeMessage('join')
    join(socket: any, data: any) {
        socket.join(data.userId);
    }

    handleConnection(client: any) {
        this.userService.updateOnlineStatus(client.handshake.query.userId, true);
        client
            .in(client.handshake.query.userId)
            .emit('ChangeOnline', true, client.handshake.query.userId);
    }

    handleDisconnect(client: any) {
        this.userService.updateOnlineStatus(client.handshake.query.userId, false);
        client
            .in(client.handshake.query.userId)
            .emit('ChangeOnline', false, client.handshake.query.userId);
    }
}
