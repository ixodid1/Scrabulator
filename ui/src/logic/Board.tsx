import Letter from "./Letter.tsx";
import Move, {MoveType} from "./Move.tsx";

export default class Board{
    boardArray: Letter[] = [];

    constructor() {
    }

    tileAt = (row: number, column: number): Letter => {
        return this.boardArray[column + (15 * row)];
    }

    setTile = (l: Letter, row: number, column: number): void => {
        this.boardArray[column + (15 * row)] = l;
    }
    isBlank = (row: number, column: number): boolean => {
        return this.boardArray[column + (15 * row)].blank;
    }

    playMove = (move: Move): void => {
        if(move.type != MoveType.Place){
            console.log("Board: Attempted to play non-place move " + move.formattedString());
        }
        for(let i = 0; i < move.word.count(); i++){
            let l: Letter = move.word.letters[i];
            if(l.newTile){
                if(move.horizontal){
                    this.setTile(l,move.row,move.column + i);
                }else{
                    this.setTile(l,move.row + i,move.column);
                }
            }
        }
    }
}