import { Server } from 'socket.io';
import { Container, Token } from 'typedi';

export const ServerToken = new Token<Server>('server')

export const initDependencyInjection = (server: Server): void => {
    Container.set(ServerToken, server);
}