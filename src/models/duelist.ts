class Duelist {

    id: string;
    deckList: Array<number>;

    constructor(id: string, deckList: Array<number>) {
        this.id = id;
        this.deckList = deckList;
    }
}

export default Duelist;