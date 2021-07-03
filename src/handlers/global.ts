import type { Socket } from 'socket.io';
import Container from 'typedi';
import DataManager from '../data_managers/data_manager';
import { ServerToken } from '../di';

const DISCONNECT_EVENT = 'disconnect';
const ERROR_EVENT = 'error';
const CLOSE_ROOM_EVENT = 'room:close';

const registerGlobalHandlers = (socket: Socket): void => {
    const disconnect = () => {
        const server = Container.get(ServerToken);
        const dataManager = Container.get(DataManager);

        const room = dataManager.getRoomByDuelistId(socket.id);
        if (room !== undefined) {
            // TODO: this is duplicate code from the room handler
            const winner = room.duelists.find(duelist => duelist.id != socket.id);

            server.sockets.in(room.roomName).emit(CLOSE_ROOM_EVENT, {
                'roomName': room.roomName,
                'winnerId': winner?.id
            });

            dataManager.closeRoom(room);
        }

        console.log(`Socket disconnected: ${socket.id}...`);
    };

    const error = (error: any) => {
        console.log(error);
        console.log(`Socket error: ${socket.id}`);
    };

    socket.on(DISCONNECT_EVENT, disconnect);
    socket.on(ERROR_EVENT, error);
};

export default registerGlobalHandlers;