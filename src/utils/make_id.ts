import { v5 as hashV5 } from "uuid";

function makeId(length: number) {
    const now = (new Date()).getTime();
    const hash = hashV5(now.toString(), "/");
    return hash.substring(0, length);
}

export default makeId;
