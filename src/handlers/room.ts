import type { Socket, Server } from 'socket.io';

import makeId from '../utils/make_id';

const CREATE_ROOM_EVENT = 'room:create';
const JOIN_ROOM_EVENT = 'room:join';
const CLOSE_ROOM_EVENT = 'room:close';

const clientRooms = new Map<string, string>();

const registerRoomHandlers = (socket: Socket, server: Server): void => {
    const createRoom = () => {
        const roomName = makeId(5);

        clientRooms.set(socket.id, roomName);
        socket.join(roomName);

        socket.emit(CREATE_ROOM_EVENT, JSON.stringify({
            'roomName': roomName
        }));

        console.log(`Room ${roomName} created by socket ${socket.id}`);
    };

    const closeRoom = (roomEventData: any) => {
        const roomName = roomEventData.roomName;

        clientRooms.delete(roomName);

        server.sockets.in(roomName).emit(CLOSE_ROOM_EVENT, JSON.stringify({
            'roomName': roomName,
        }));

        const room = server.sockets.adapter.rooms[roomName];
        if (room) {
            Object.keys(room.sockets).forEach((id) => server.sockets.connected[id].leave(roomName));
        }

        console.log(`Room ${roomName} was closed`);
    };

    const joinRoom = (roomEventData: any) => {
        const roomName = roomEventData.roomName;
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
            console.log(`Socket ${socket.id} could not join room ${roomName}: roomNotFound`);

            socket.emit(JOIN_ROOM_EVENT, JSON.stringify({
                'roomName': roomName,
                'ready': false,
                'error': 'roomNotFound'
            }));
            return;
        }

        if (numClients > 1) {
            console.log(`Socket ${socket.id} could not join room ${roomName}: tooManyPlayers`);

            socket.emit(JOIN_ROOM_EVENT, JSON.stringify({
                'roomName': roomName,
                'ready': false,
                'error': 'tooManyPlayers'
            }));
            return;
        }

        clientRooms.set(socket.id, roomName);
        socket.join(roomName);

        server.sockets.in(roomName).emit(JOIN_ROOM_EVENT, JSON.stringify({
            'roomName': roomName,
            'ready': true
        }));

        console.log(`Room ${roomName} joined by socket ${socket.id}`);
    };

    socket.on(CREATE_ROOM_EVENT, createRoom);
    socket.on(CLOSE_ROOM_EVENT, closeRoom);
    socket.on(JOIN_ROOM_EVENT, joinRoom);
};

export default registerRoomHandlers;