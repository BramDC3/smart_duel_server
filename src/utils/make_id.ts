import { v5 as hashV5 } from "uuid";

function makeId() {
    const now = (new Date()).getTime();
    const hash = hashV5(now.toString(), "f3403d05-6af1-4860-89fc-fa0383badecb");
    return hash;
}

export default makeId;
