import type { Socket } from 'socket.io';

import clientRooms from '../global/client_rooms';

const PLAY_CARD_EVENT = 'card:play';
const REMOVE_CARD_EVENT = 'card:remove';

const registerCardHandlers = (socket: Socket): void => {
    const playCard = (data: any) => {
        const roomName = clientRooms.get(socket.id);
        if (roomName != undefined) {
            socket.in(roomName).emit(PLAY_CARD_EVENT, data);
        }

        console.log(`Socket ${socket.id} played a card in room ${roomName}. Event data:`);
        console.log(data);
    };

    const removeCard = (data: any) => {
        const roomName = clientRooms.get(socket.id);
        if (roomName != undefined) {
            socket.in(roomName).emit(REMOVE_CARD_EVENT, data);
        }

        console.log(`Socket ${socket.id} removed a card in room ${roomName}. Event data:`);
        console.log(data);
    };

    socket.on(PLAY_CARD_EVENT, playCard);
    socket.on(REMOVE_CARD_EVENT, removeCard);
};

export default registerCardHandlers;