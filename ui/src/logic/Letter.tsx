
export default class Letter{

    idx: number = -1;
    blank:boolean = false;
    newTile:boolean = true;

    constructor(idx: number, blank: boolean, newTile: boolean) {

    }
    toCharCode = (): number => {
        return (this.idx + 'a'.charCodeAt(0));
    }

}