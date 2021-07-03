import config from 'config';
import type http from 'http';
import ioserver, { Server } from 'socket.io';

const PING_TIMEOUT = config.get<number>('SOCKET.PING_TIMEOUT');
const PING_INTERVAL = config.get<number>('SOCKET.PING_INTERVAL');

const createSocket = (server: http.Server): Server => {
    return ioserver(server, {
        pingTimeout: PING_TIMEOUT,
        pingInterval: PING_INTERVAL,
    });
};

export default createSocket;