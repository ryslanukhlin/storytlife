import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

let _context: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export function SocketIo(socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null) {
    if (_context === null) _context = socket;

    return (function () {
        return _context;
    })();
}
