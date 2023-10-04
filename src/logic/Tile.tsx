export default class Tile{
    tileIdx: number = -1;
    constructor(idx: number){
        this.tileIdx = idx;
    }
    fromChar(c: string): Tile{
        if(c.length != 1){
            return new Tile(-1);
        }
        return new Tile(c == "?" ? 26 : c.charCodeAt(0) - 97);
    }
    toChar(): string{
        return this.tileIdx == 26 ? '?' : String.fromCharCode(this.tileIdx + 97);
    }

}