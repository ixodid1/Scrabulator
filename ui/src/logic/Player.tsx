import Rack from "./Rack.tsx";

const PlayerType = {
    Human: "Human",
    Computer: "Compooter"
}
export default class Player{

    name: string = "";
    score: number = 0;
    rack: Rack = new Rack();
    type: string = PlayerType.Human;

    constructor() {

    }
    reset = (): void => {
        this.rack.clearRack();
        this.name = "";
        this.score = 0;
    }
}