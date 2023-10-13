import Rack from "./Rack.tsx";

export const PlayerType = {
    Human: "Human",
    Computer: "Compooter"
}
export default class Player{

    name: string = "";
    score: number = 0;
    rack: Rack = new Rack();
    type: string = PlayerType.Human;

    constructor(name:string = "", score:number = 0, rack: Rack = new Rack(), type:string = PlayerType.Human) {
        this.name = name;
        this.score = score;
        this.rack = rack;
        this.type = type;
    }
    reset = (): void => {
        this.rack.clearRack();
        this.name = "";
        this.score = 0;
    }
}