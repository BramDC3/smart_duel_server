import type { Socket, Server } from 'socket.io';
import duelRooms from '../global/duel_rooms';

const DISCONNECT_EVENT = 'disconnect';
const ERROR_EVENT = 'error';
const CLOSE_ROOM_EVENT = 'room:close';

const registerGlobalHandlers = (socket: Socket, server: Server): void => {
    const disconnect = () => {
        const room = duelRooms.find(duelRoom => duelRoom.duelists.map(duelist => duelist.id).find(id => id == socket.id));
        if (room !== undefined) {
            // TODO: this is duplicate code from the room handler
            const roomName = room.roomName;
            const winner = room.duelists.find(duelist => duelist.id != socket.id);

            // Emit event
            server.sockets.in(roomName).emit(CLOSE_ROOM_EVENT, {
                'roomName': roomName,
                'winnerId': winner?.id
            });

            // Disconnect socket from room
            room.duelists.forEach((duelist) => server.sockets.connected[duelist.id]?.leave(roomName));

            // Delete duel room
            const roomIndex = duelRooms.indexOf(room);
            duelRooms.splice(roomIndex, 1);
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