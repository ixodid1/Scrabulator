import Bag from "./Bag.tsx";
import {baseTileCounts} from "./Constants.tsx";

export default class Rack{
    constructor() {
        this.freqMap.length = 27;
        for(let i = 0; i < 27; i++){
            this.freqMap[i] = 0;
        }
    }
    freqMap: number[] = [];
    count: number = 0;

    addTile(idx: number){
        if(idx > 26){
            console.log("Invalid rack tile idx " + idx);
        }
        this.freqMap[idx]++;
        this.count++;
    }
    removeTile(idx: number){
        if(idx > 26 || this.freqMap[idx] == 0){
            console.log("Attempting to remove nonexistent tile " + idx);
        }
        this.freqMap[idx]--;
        this.count--;
    }

    hasTile(idx: number): boolean {
        return this.freqMap[idx] > 0;
    }

    empty = (): boolean => {
        return this.count == 0;
    }

    clearRack = (): void => {
        for(let i = 0; i < 27; i++){
            this.freqMap[i] = 0;
            this.count = 0;
        }
    }
    drawTiles(bag: Bag, removeFromBag: boolean){
        if(!bag.empty()){
            while(this.count < 7){
                let idx = bag.getTile(removeFromBag);
                if(idx != -1){
                    this.addTile(idx);
                }else{
                    break;
                }
            }
        }
    }

    toString = (): string => {
        let temp = "";
        for(let i = 0; i < 27; i++){
            for(let k = 0; k < this.freqMap[i]; k++){
                temp += (i == 26 ? '?' : String.fromCharCode(i + 97));
            }
        }
        return temp;
    }

    clone = (): Rack => {
        let temp: Rack = new Rack();
        for(let i = 0; i < 27; i++){
            temp.freqMap[i] = this.freqMap[i];
        }
        temp.count = this.count;
        return temp;
    }

}
export function rackFromString(s: string) {
    let temp: Rack = new Rack();
    for(let i = 0; i < s.length; i++){
        if(s.charCodeAt(i) >= 97 && s.charCodeAt(i) <= 122){
            temp.addTile(s.charCodeAt(i) - 97);
        }
        if(s.charAt(i) == '?'){
            temp.addTile(26);
        }
    }
    return temp;
}