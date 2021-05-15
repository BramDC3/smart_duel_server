import { Socket } from "socket.io";
import { sendMessageToOpponent } from "../services/socketsService";

const ADMIT_DEFEAT = "duel:admit_defeat";
const LIFE_POINTS_CHANGING = "duel:life_points_changed";
const OPPONENTS_LIFE_POINTS_CHANGING = "duel:opponent_life_points_changing";

const registerGlobalDuelHandlers = (socket: Socket) => {
    const opponentLifePointsChanged = (data: string) => {
        console.log(data);
        sendMessageToOpponent(socket, OPPONENTS_LIFE_POINTS_CHANGING, data);
    };
    
    const lifePointsChanged = (data: string) => {
        console.log(data);
        sendMessageToOpponent(socket, LIFE_POINTS_CHANGING, data);
    };

    const admitDefeat = () => {
        sendMessageToOpponent(socket, ADMIT_DEFEAT, "");
    };

    socket.on(ADMIT_DEFEAT, admitDefeat);
    socket.on(OPPONENTS_LIFE_POINTS_CHANGING, opponentLifePointsChanged);
    socket.on(LIFE_POINTS_CHANGING, lifePointsChanged);
};

export default registerGlobalDuelHandlers;
