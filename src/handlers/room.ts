import type { Socket, Server } from 'socket.io';

import makeId from '../utils/make_id';
import duelRooms from '../global/duel_rooms';
import Duelist from '../models/duelist';
import DuelRoom from '../models/duel_room';
import RoomEventData from '../models/room_event_data';

const CREATE_ROOM_EVENT = 'room:create';
const CLOSE_ROOM_EVENT = 'room:close';
const JOIN_ROOM_EVENT = 'room:join';
const START_ROOM_EVENT = 'room:start';

const registerRoomHandlers = (socket: Socket, server: Server): void => {
    const createRoom = (data: RoomEventData) => {
        const deckList = data.deckList;
        if (deckList === undefined) {
            return;
        }

        // Create duelist
        const duelist = new Duelist(socket.id, deckList);

        // Create room
        const roomName = makeId(5);
        const room = new DuelRoom(roomName);
        duelRooms.push(room);

        // Let duelist join room
        room.duelists.push(duelist);
        socket.join(roomName);

        // Emit event
        socket.emit(CREATE_ROOM_EVENT, {
            'roomName': roomName
        });

        console.log(`Room ${roomName} created by socket ${socket.id}`);
    };

    const closeRoom = (data: RoomEventData) => {
        const roomName = data.roomName;
        if (roomName === undefined) {
            return;
        }

        // Emit event
        server.sockets.in(roomName).emit(CLOSE_ROOM_EVENT, {
            'roomName': roomName,
        });

        const room = duelRooms.find(duelRoom => duelRoom.roomName === roomName);
        if (room !== undefined) {
            // Disconnect socket from room
            room.duelists.forEach((duelist) => server.sockets.connected[duelist.id].leave(roomName));

            // Delete duel room
            const roomIndex = duelRooms.indexOf(room);
            duelRooms.splice(roomIndex, 1);
        }

        console.log(`Room ${roomName} was closed`);
    };

    const joinRoom = (data: RoomEventData) => {
        const roomName = data.roomName;
        const deckList = data.deckList;
        if (roomName === undefined || deckList === undefined) {
            return;
        }


        const room = duelRooms.find(duelRoom => duelRoom.roomName === roomName);

        // Check if room exists
        if (room === undefined) {
            console.log(`Socket ${socket.id} could not join room ${roomName}: roomNotFound`);

            socket.emit(JOIN_ROOM_EVENT, {
                'roomName': roomName,
                'error': 'roomNotFound'
            });
            return;
        }

        // Check if there is still room for this duelist
        if (room.duelists.length >= room.duelistLimit) {
            console.log(`Socket ${socket.id} could not join room ${roomName}: tooManyPlayers`);

            socket.emit(JOIN_ROOM_EVENT, {
                'roomName': roomName,
                'error': 'tooManyPlayers'
            });
            return;
        }

        // Create duelist
        const duelist = new Duelist(socket.id, deckList);

        // Let duelist join room
        room.duelists.push(duelist);
        socket.join(roomName);

        // Emit event
        server.sockets.in(roomName).emit(START_ROOM_EVENT, {
            'roomName': roomName,
            'duelRoom': room
        });

        console.log(`Room ${roomName} joined by socket ${socket.id}`);
    };

    socket.on(CREATE_ROOM_EVENT, createRoom);
    socket.on(CLOSE_ROOM_EVENT, closeRoom);
    socket.on(JOIN_ROOM_EVENT, joinRoom);
};

export default registerRoomHandlers;