import { log } from "console";
import { Socket } from "socket.io";
import globals from "../globals";

function getSocketRoom(id: string): string {
    const room = globals.clientRooms.get(id);
    if (!room) {
        throw new Error(`Unable to get socket room for id : ${id}`);
    }
    return room;
}

export function sendMessageUsersInRoom(socket: Socket, message: string, datas: any) {
    try {
        socket.to(getSocketRoom(socket.id)).emit(message, datas);
    } catch (exception) {
        log(exception.message);
        socket.emit("room:unknow", "");
    }
}
