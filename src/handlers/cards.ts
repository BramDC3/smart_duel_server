import type { Socket } from 'socket.io';
import Container from 'typedi';
import DataManager from '../data_managers/data_manager';

const PLAY_CARD_EVENT = 'card:play';
const REMOVE_CARD_EVENT = 'card:remove';

const registerCardHandlers = (socket: Socket): void => {
    const playCard = (data: any) => {
        const dataManager = Container.get(DataManager);

        const room = dataManager.getRoomByDuelistId(socket.id);
        if (room !== undefined) {
            socket.in(room.roomName).emit(PLAY_CARD_EVENT, data);
        }

        console.log(`Socket ${socket.id} played a card in room ${room?.roomName}. Event data:`);
        console.log(data);
    };

    const removeCard = (data: any) => {
        const dataManager = Container.get(DataManager);

        const room = dataManager.getRoomByDuelistId(socket.id);
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