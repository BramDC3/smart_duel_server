import type { Server } from 'socket.io';

import registerGlobalHandlers from './global';
import registerCardHandlers from './cards';

const CONNECTION_EVENT = 'connection';

const registerHandlers = (socket: Server) => {
    socket.on(CONNECTION_EVENT, (socket) => {
        console.log(`Socket connect: ${socket.id}`, );

        registerGlobalHandlers(socket);
        registerCardHandlers(socket);
    });
};

export default registerHandlers;