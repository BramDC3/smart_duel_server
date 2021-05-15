import type { Socket, Server } from 'socket.io';
import globals from "../globals";
import makeId from '../utils/make_id';

const CREATE_ROOM_EVENT = 'room:create';
const LIST_ROOMS_EVENT = 'room:list';
const ENTER_ROOM_EVENT = 'room:enter';

const registerRoomHandlers = (socket: Socket, server: Server) => {
    const createRoom = () => {
        const roomName = makeId(5);

        globals.clientRooms.set(socket.id, roomName);
        socket.emit('roomName', roomName);

        socket.join(roomName);
        socket.emit('init', 1);

        console.log(`Room ${roomName} created by socket ${socket.id}`);
    };

    const listRooms = () => {
        const rooms = server.sockets.adapter.rooms;
        const allRoomsAvailable = [];

        for (const room in rooms) {
            if (rooms[room].length === 1) {
                allRoomsAvailable.push(room);
            }
        }

        socket.emit('availableRooms', JSON.stringify(allRoomsAvailable));
    };

    const enterRoom = (roomName: string) => {
        const room = server.sockets.adapter.rooms[roomName];
        let numClients = 0;

        if (room) {
            numClients = room.length;
        }

        if (numClients === 0) {
            socket.emit('unknownRoom');
            return;
        }

        if (numClients > 1) {
            socket.emit('tooManyPlayers');
            return;
        }

        globals.clientRooms.set(socket.id, roomName);
        socket.join(roomName);
        socket.emit('init', 2);

        console.log(`Room ${roomName} joined by by socket ${socket.id}`);
    };

    socket.on(CREATE_ROOM_EVENT, createRoom);
    socket.on(LIST_ROOMS_EVENT, listRooms);
    socket.on(ENTER_ROOM_EVENT, enterRoom);
};

export default registerRoomHandlers;
