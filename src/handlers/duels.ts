import { Socket } from "socket.io";
import { sendMessageUsersInRoom } from "../services/socketsService";

const ADMIT_DEFEAT = "duel:admit_defeat";
const LIFE_POINTS_CHANGING = "duel:life_points_changed";
const MONSTERS_BATTLE = "duel:monsters_battle";
const OPPONENTS_LIFE_POINTS_CHANGING = "duel:opponent_life_points_changing";

const registerDuelHandlers = (socket: Socket) => {
    const opponentLifePointsChanged = (data: string) => {
        console.log(data);
        sendMessageUsersInRoom(socket, OPPONENTS_LIFE_POINTS_CHANGING, data);
    };
    
    const lifePointsChanged = (data: string) => {
        console.log(data);
        sendMessageUsersInRoom(socket, LIFE_POINTS_CHANGING, data);
    };

    const monstersBattle = (data: string) => {
        // Battle between two cards
        console.log(data);
        sendMessageUsersInRoom(socket, MONSTERS_BATTLE, data);
    };

    const admitDefeat = () => {
        sendMessageUsersInRoom(socket, ADMIT_DEFEAT, "");
    };

    socket.on(ADMIT_DEFEAT, admitDefeat);
    socket.on(LIFE_POINTS_CHANGING, lifePointsChanged);
    socket.on(MONSTERS_BATTLE, monstersBattle);
    socket.on(OPPONENTS_LIFE_POINTS_CHANGING, opponentLifePointsChanged);
};

export default registerDuelHandlers;
