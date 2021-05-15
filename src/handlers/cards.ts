import type { Socket } from 'socket.io';
import globals from "../globals";

const PLAY_CARD_EVENT = 'card:play';
const REMOVE_CARD_EVENT = 'card:remove';

const registerCardHandlers = (socket: Socket) => {
    const playCard = (data: any) => {
        console.log(data);
        socket.to(globals.clientRooms.get(socket.id) ?? "/").emit(PLAY_CARD_EVENT, data);
    };

    const removeCard = (data: any) => {
        console.log(data);
        socket.to(globals.clientRooms.get(socket.id) ?? "/").emit(REMOVE_CARD_EVENT, data);
    };

    socket.on(PLAY_CARD_EVENT, playCard);
    socket.on(REMOVE_CARD_EVENT, removeCard);
};

export default registerCardHandlers;
