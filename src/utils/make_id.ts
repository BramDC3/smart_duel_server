const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// TODO: find a better way to make ids
const makeId = (length: number) => {
    let id = '';

    for (let i = 0; i < length; i++) {
        id += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }

    return id;
}

export default makeId;