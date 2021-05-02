import type { Socket } from 'socket.io';

const DISCONNECT_EVENT = 'disconnect';
const ERROR_EVENT = 'error';

const registerGlobalHandlers = (socket: Socket) => {
    const disconnect = () => {
        console.log(`Disconnecting socket ${socket.id}...`);
    };

    const error = (error: any) => {
        console.log(error);
        console.log(`Error received from socket ${socket.id}`);
    };

    socket.on(DISCONNECT_EVENT, disconnect);
    socket.on(ERROR_EVENT, error);
};

export default registerGlobalHandlers;