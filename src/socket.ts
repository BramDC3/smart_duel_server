import config from 'config';
import type http from 'http';
import ioserver, { Server } from 'socket.io';

const PING_TIMEOUT = config.get<number>('SOCKET.PING_TIMEOUT');
const PING_INTERVAL = config.get<number>('SOCKET.PING_INTERVAL');

import registerHandlers from './handlers';

const createSocket = (server: http.Server): Server => {
    const socket = ioserver(server, {
        pingTimeout: PING_TIMEOUT,
        pingInterval: PING_INTERVAL,
    });

    registerHandlers(socket);

    return socket;
};

export default createSocket;