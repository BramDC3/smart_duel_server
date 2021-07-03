import { Service } from 'typedi';
import DuelRoom from '../models/duel_room';
import DuelRoomDataManager from './duel_room/duel_room_data_manager';
import DuelRoomDataManagerImpl from './duel_room/duel_room_data_manager_impl';

@Service()
class DataManager implements DuelRoomDataManager {

    constructor(private readonly duelRoomDataManager: DuelRoomDataManagerImpl) { }

    createRoom(): DuelRoom {
        return this.duelRoomDataManager.createRoom();
    }

    getRoomByRoomName(roomName: string): DuelRoom | undefined {
        return this.duelRoomDataManager.getRoomByRoomName(roomName);
    }

    getRoomByDuelistId(duelistId: string): DuelRoom | undefined {
        return this.duelRoomDataManager.getRoomByDuelistId(duelistId);
    }

    closeRoomByRoomName(roomName: string): void {
        this.duelRoomDataManager.closeRoomByRoomName(roomName);
    }

    closeRoom(room: DuelRoom): void {
        this.duelRoomDataManager.closeRoom(room);
    }
}

export default DataManager;