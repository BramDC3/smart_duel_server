import type { Socket, Server } from 'socket.io';

import makeId from '../utils/make_id';

const CREATE_ROOM_EVENT = 'room:create';
const ENTER_ROOM_EVENT = 'room:enter';

const clientRooms = new Map<string, string>();

const registerRoomHandlers = (socket: Socket, server: Server) => {
    const createRoom = () => {
        const roomName = makeId(5);

        clientRooms.set(socket.id, roomName);
        socket.emit('roomName', roomName);

        socket.join(roomName);
        socket.emit('init', 1);

        console.log(`Room ${roomName} created by socket ${socket.id}`);
    };

    const enterRoom = (roomName: string) => {
        const room = server.sockets.adapter.rooms[roomName];

        let allUsers;
        if (room) {
            allUsers = room.sockets;
        }

        let numClients = 0;
        if (allUsers) {
            numClients = Object.keys(allUsers).length;
        }

        if (numClients === 0) {
            socket.emit('unknownRoom');
            return;
        }

        if (numClients > 1) {
            socket.emit('tooManyPlayers');
            return;
        }

        clientRooms.set(socket.id, roomName);
        socket.join(roomName);
        socket.emit('init', 2);

        console.log(`Room ${roomName} joined by by socket ${socket.id}`);
    };

    socket.on(CREATE_ROOM_EVENT, createRoom);
    socket.on(ENTER_ROOM_EVENT, enterRoom);
};

export default registerRoomHandlers;