import type { Server } from 'socket.io';

import registerGlobalHandlers from './global';
import registerCardHandlers from './cards';
import registerRoomHandlers from './room';

const CONNECTION_EVENT = 'connection';

const registerHandlers = (server: Server): void => {
    server.on(CONNECTION_EVENT, (socket) => {
        console.log(`Socket connected: ${socket.id}`,);

        registerGlobalHandlers(socket);
        registerCardHandlers(socket);
        registerRoomHandlers(socket, server);
    });
};

export default registerHandlers;