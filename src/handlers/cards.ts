import type { Socket } from 'socket.io';

import duelRooms from '../global/duel_rooms';

const PLAY_CARD_EVENT = 'card:play';
const REMOVE_CARD_EVENT = 'card:remove';

const registerCardHandlers = (socket: Socket): void => {
    const playCard = (data: any) => {
        const room = duelRooms.find(duelRoom => duelRoom.duelists.map(duelist => duelist.id).includes(socket.id));
        if (room !== undefined) {
            socket.in(room.roomName).emit(PLAY_CARD_EVENT, data);
        }

        console.log(`Socket ${socket.id} played a card in room ${room?.roomName}. Event data:`);
        console.log(data);
    };

    const removeCard = (data: any) => {
        const room = duelRooms.find(duelRoom => duelRoom.duelists.map(duelist => duelist.id).includes(socket.id));
        if (room !== undefined) {
            socket.in(room.roomName).emit(REMOVE_CARD_EVENT, data);
        }

        console.log(`Socket ${socket.id} removed a card in room ${room?.roomName}. Event data:`);
        console.log(data);
    };

    socket.on(PLAY_CARD_EVENT, playCard);
    socket.on(REMOVE_CARD_EVENT, removeCard);
};

export default registerCardHandlers;