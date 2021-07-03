import DuelRoom from '../../models/duel_room';

interface DuelRoomDataManager {

    createRoom(): DuelRoom;
    getRoomByRoomName(roomName: string): DuelRoom | undefined;
    getRoomByDuelistId(duelistId: string): DuelRoom | undefined;
    closeRoomByRoomName(roomName: string): void;
    closeRoom(room: DuelRoom): void;
}

export default DuelRoomDataManager;