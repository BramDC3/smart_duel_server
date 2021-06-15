import Duelist from './duelist';

class DuelRoom {

    roomName: string;
    duelists: Array<Duelist> = [];
    duelistLimit = 2;

    constructor(roomName: string) {
        this.roomName = roomName;
    }
}

export default DuelRoom;