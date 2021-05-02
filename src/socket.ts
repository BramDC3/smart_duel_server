import config from 'config';
import type http from 'http';

const PING_TIMEOUT = config.get<number>('SOCKET.PING_TIMEOUT');
const PING_INTERVAL = config.get<number>('SOCKET.PING_INTERVAL');

import registerHandlers from './handlers';

const createSocket = (server: http.Server) => {
    // TODO: importing Server from socket.io and using it here gives an error.
    const socket = require('socket.io')(server, {
        pingTimeout: PING_TIMEOUT,
        pingInterval: PING_INTERVAL,
    });

    registerHandlers(socket);

    return socket;
};

export default createSocket;