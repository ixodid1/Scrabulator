import "./Constants.tsx"
import {baseTileCounts} from "./Constants.tsx";
export default class Bag{
    letters: number[] = [];

    constructor() {
        this.resetBag();
    }
    getTile = (removeFromBag: boolean): number => {
        let letterAt = this.letters[this.letters.length - 1];
        if(removeFromBag){
            if(this.empty()){
                return -1;
            }else{
                this.letters.pop();
            }
        }
        return letterAt;
    }
    count = (): number => {
        return this.letters.length;
    }
    empty = () : boolean => {
        return this.letters.length == 0;
    }

    resetBag = () => {
        this.letters.length = 0;
        for(let i = 0; i < 27; i++){
            for(let k = 0; k < baseTileCounts[i]; k++){
                this.letters.push(i);
            }
        }
        this.shuffleArray(this.letters);

    }
    shuffleArray(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}