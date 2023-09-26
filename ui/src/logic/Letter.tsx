
export default class Letter{

    idx: number = -1;
    blank:boolean = false;
    newTile:boolean = true;

    constructor(idx: number, blank: boolean, newTile: boolean) {
        this.idx = idx;
        this.blank = blank;
        this.newTile = newTile;
    }
    toCharCode = (): number => {
        return (this.idx + 'a'.charCodeAt(0));
    }
    null = (): boolean => {
        return this.idx == -1;
    }

}