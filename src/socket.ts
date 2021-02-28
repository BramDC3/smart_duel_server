import { Server } from 'socket.io';
import config from 'config';
import type http from 'http';

const PING_TIMEOUT = config.get<number>('SOCKET.PING_TIMEOUT');
const PING_INTERVAL = config.get<number>('SOCKET.PING_INTERVAL');

import registerHandlers from './handlers';

const createSocket = (server: http.Server) => {
  const socket = new Server(server, {
    pingTimeout: PING_TIMEOUT,
    pingInterval: PING_INTERVAL,
  });
  registerHandlers(socket);

  return socket;
};

export default createSocket;
