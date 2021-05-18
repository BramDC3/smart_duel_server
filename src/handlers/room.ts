import type { Socket, Server } from 'socket.io';

import makeId from '../utils/make_id';
import RoomEventData from '../models/room_event_data';

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

    const closeRoom = (data: any) => {
        const roomEventData: RoomEventData = JSON.parse(data);
        const roomName = roomEventData.roomName;

        clientRooms.delete(roomName);
        // TODO: let all sockets leave this room
    };

    const joinRoom = (data: any) => {
        const roomEventData: RoomEventData = JSON.parse(data);
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
            socket.emit(JOIN_ROOM_EVENT, JSON.stringify({
                'ready': false,
                'error': 'roomNotFound'
            }));
            return;
        }

        if (numClients > 1) {
            socket.emit(JOIN_ROOM_EVENT, JSON.stringify({
                'ready': false,
                'error': 'tooManyPlayers'
            }));
            return;
        }

        clientRooms.set(socket.id, roomName);
        socket.join(roomName);

        server.sockets.in(roomName).emit(JOIN_ROOM_EVENT, JSON.stringify({
            'ready': true
        }));

        console.log(`Room ${roomName} joined by socket ${socket.id}`);
    };

    socket.on(CREATE_ROOM_EVENT, createRoom);
    socket.on(JOIN_ROOM_EVENT, joinRoom);
};

export default registerRoomHandlers;