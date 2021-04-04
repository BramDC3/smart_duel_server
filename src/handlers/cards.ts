import type { Socket } from 'socket.io';

const SUMMON_EVENT = 'summonEvent';
const REMOVE_CARD_EVENT = 'removeCardEvent';

const registerCardHandlers = (socket: Socket) => {
  const broadcastSummonEvent = (data: any) => {
    console.log(data);
    socket.broadcast.emit('summonEvent', data);
  };

  const removeCard = (data: any) => {
    console.log(data);
    socket.broadcast.emit('removeCardEvent', data);
  };

  socket.on(SUMMON_EVENT, broadcastSummonEvent);
  socket.on(REMOVE_CARD_EVENT, removeCard);
};

export default registerCardHandlers;
