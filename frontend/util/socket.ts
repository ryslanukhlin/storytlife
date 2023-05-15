import { Socket, io } from 'socket.io-client';
import { SocketIoPort } from '../config';
import { userData } from '../graphql/store/auth';
import { DefaultEventsMap } from '@socket.io/component-emitter';

let _context: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export function SocketIo(socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null) {
    if (_context === null) _context = socket;

    return (function () {
        return _context;
    })();
}
