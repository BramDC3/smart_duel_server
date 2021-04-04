import type { Server } from 'socket.io';

import registerGlobalHandlers from './global';
import registerCardHandlers from './cards';

const registerHandlers = (socket: Server) => {
  socket.on('connection', (socket) => {
    // Register handlers
    registerGlobalHandlers(socket);
    registerCardHandlers(socket);
  });
};

export default registerHandlers;
