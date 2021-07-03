import type { Server } from 'socket.io';
import { Inject, Service } from 'typedi';
import { ServerToken } from '../../di';

import DuelRoom from '../../models/duel_room';
import makeId from '../../utils/make_id';
import DuelRoomDataManager from './duel_room_data_manager';

@Service()
class DuelRoomDataManagerImpl implements DuelRoomDataManager {

    private readonly duelRooms = new Array<DuelRoom>();

    constructor(@Inject(ServerToken) private readonly server: Server) { }

    createRoom(): DuelRoom {
        const roomName = makeId(5);
        const room = new DuelRoom(roomName);
        this.duelRooms.push(room);

        return room;
    }

    getRoomByRoomName(roomName: string): DuelRoom | undefined {
        return this.duelRooms.find(duelRoom => duelRoom.roomName === roomName);
    }

    getRoomByDuelistId(duelistId: string): DuelRoom | undefined {
        return this.duelRooms.find(duelRoom => duelRoom.duelists.map(duelist => duelist.id).includes(duelistId));
    }

    closeRoomByRoomName(roomName: string): void {
        const room = this.getRoomByRoomName(roomName);
        if (room === undefined) {
            return;
        }

        this.closeRoom(room);
    }

    closeRoom(room: DuelRoom): void {
        this.disconnectSocketsFromRoom(room);
        this.deleteDuelRoom(room);
    }

    private disconnectSocketsFromRoom = (room: DuelRoom) => {
        room.duelists.forEach((duelist) => this.server.sockets.connected[duelist.id]?.leave(room.roomName));
    }

    private deleteDuelRoom = (room: DuelRoom) => {
        const roomIndex = this.duelRooms.indexOf(room);
        this.duelRooms.splice(roomIndex, 1);
    }
}

export default DuelRoomDataManagerImpl;