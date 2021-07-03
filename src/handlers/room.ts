import type { Socket } from 'socket.io';

import Duelist from '../models/duelist';
import RoomEventData from '../models/room_event_data';
import Container from 'typedi';
import DataManager from '../data_managers/data_manager';
import { ServerToken } from '../di';

const CREATE_ROOM_EVENT = 'room:create';
const CLOSE_ROOM_EVENT = 'room:close';
const JOIN_ROOM_EVENT = 'room:join';
const START_ROOM_EVENT = 'room:start';
const SURRENDER_ROOM_EVENT = 'room:surrender';

const registerRoomHandlers = (socket: Socket): void => {
    const createRoom = (data: RoomEventData) => {
        const dataManager = Container.get(DataManager);

        const deckList = data.deckList;
        if (deckList === undefined) {
            return;
        }

        // Create duelist
        const duelist = new Duelist(socket.id, deckList);

        // Create room
        const room = dataManager.createRoom();

        // Let duelist join room
        room.duelists.push(duelist);
        socket.join(room.roomName);

        // Emit event
        socket.emit(CREATE_ROOM_EVENT, {
            'roomName': room.roomName
        });

        console.log(`Room ${room.roomName} created by socket ${socket.id}`);
    };

    const closeRoom = (data: RoomEventData) => {
        const server = Container.get(ServerToken);
        const dataManager = Container.get(DataManager);

        const roomName = data.roomName;
        if (roomName === undefined) {
            return;
        }

        // Emit event
        server.sockets.in(roomName).emit(CLOSE_ROOM_EVENT, {
            'roomName': roomName
        });

        dataManager.closeRoomByRoomName(roomName);

        console.log(`Room ${roomName} was closed`);
    };

    const joinRoom = (data: RoomEventData) => {
        const server = Container.get(ServerToken);
        const dataManager = Container.get(DataManager);

        const roomName = data.roomName;
        const deckList = data.deckList;
        if (roomName === undefined || deckList === undefined) {
            return;
        }

        const room = dataManager.getRoomByRoomName(roomName);

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
            'duelRoom': room
        });

        console.log(`Room ${roomName} joined by socket ${socket.id}`);
    };

    const surrenderRoom = (data: RoomEventData) => {
        const server = Container.get(ServerToken);
        const dataManager = Container.get(DataManager);

        const roomName = data.roomName;
        if (roomName === undefined) {
            return;
        }

        const room = dataManager.getRoomByRoomName(roomName);
        if (room === undefined) {
            return;
        }

        const winner = room.duelists.find(duelist => duelist.id != socket.id);

        // Emit event
        server.sockets.in(roomName).emit(CLOSE_ROOM_EVENT, {
            'roomName': roomName,
            'winnerId': winner?.id
        });

        dataManager.closeRoomByRoomName(roomName);

        console.log(`Duelist ${socket.id} surrendered. Room ${roomName} was closed`);
    }

    socket.on(CREATE_ROOM_EVENT, createRoom);
    socket.on(CLOSE_ROOM_EVENT, closeRoom);
    socket.on(JOIN_ROOM_EVENT, joinRoom);
    socket.on(SURRENDER_ROOM_EVENT, surrenderRoom);
};

export default registerRoomHandlers;