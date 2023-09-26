import { tileValues, specialSquares } from "./Constants.tsx";
import Letter from "./Letter.tsx";
import Move, {MoveType} from "./Move.tsx";

export default class Board{
    boardArray: Letter[] = [];

    constructor() {
        for(let i = 0; i < 225; i++){
            this.boardArray.push(new Letter(-1,false,false));
        }
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
    calcScore = (move: Move): number => {
        let score = 0;
        if(move.type != MoveType.Place){
            return 0;
        }
        let mul = 1;
        let mainScore = 0;
        let crossScore = 0;
        let row = move.row;
        let col = move.column;

        let newTileCt = 0;
        for(let i = 0; i < move.word.count(); i++){
            let cur: Letter = move.word.letters[i];
            let pointValue = cur.blank ? 0 : tileValues[cur.idx];
            if(cur.newTile){
                newTileCt++;
                if(specialSquares[col + (15 * row)] != 0){
                    let ss = specialSquares[col + (15 * row)];
                    if(ss == 1){
                        pointValue *= 2;
                    }else if(ss == 2){
                        pointValue *= 3;
                    }else if(ss == 3){
                        mul = 2;
                    }else if(ss == 4){
                        mul = 3;
                    }
                }
                crossScore += this.calcPerpScore(row,col,cur.idx,move.horizontal,cur.blank);
            }
            mainScore += pointValue;
            if(move.horizontal){
                col++;
            }else{
                row++;
            }
        }
        return (mainScore * mul) + crossScore + (newTileCt == 7 ? 50 : 0);
    }
    getCrossScore = (row: number, col: number, horizontal: boolean): number => {
        let score = 0;
        if(horizontal){
            if(row < 14){
                for(let i = row + 1; i < 15; i++){
                    if(this.tileAt(i,col).null()){
                        break;
                    }else{
                        score += tileValues[this.tileAt(i,col).idx];
                    }
                }
            }
            if(row > 0){
                for(let i = row - 1; i >= 0; i--){
                    if(this.tileAt(i,col).null()){
                        break;
                    }else{
                        score += tileValues[this.tileAt(i,col).idx];
                    }
                }
            }
        }else{
            if(col < 14){
                for(let i = col + 1; i < 15; i++){
                    if(this.tileAt(row,col).null()){
                        break;
                    }else{
                        score += tileValues[this.tileAt(row,i).idx];
                    }
                }
            }
            if(col > 0){
                for(let i = col - 1; i >= 0; i--){
                    if(this.tileAt(i,col).null()){
                        break;
                    }else{
                        score += tileValues[this.tileAt(i,col).idx];
                    }
                }
            }
        }
        return score;
    }
    calcPerpScore = (row: number, col: number, tileIdx: number, horizontal: boolean, blank: boolean): number => {
        let mul = 1;
        let totalScore = blank ? 0 : tileValues[tileIdx];
        if(specialSquares[col + (15 * row)] != 0){
            let ss = specialSquares[col + (15 * row)];
            if(ss == 1){
                totalScore *= 2;
            }else if(ss == 2){
                totalScore *= 3;
            }else if(ss == 3){
                mul = 2;
            }else if(ss == 4){
                mul = 3;
            }
        }
        let hasCross = false;
        if(horizontal){
            if(row < 14){
                if(!this.tileAt(row + 1,col).null()){
                    hasCross = true;
                }
            }
            if(row > 0){
                if(!this.tileAt(row - 1,col).null()){
                    hasCross = true;
                }
            }
        }else{
            if(col < 14){
                if(!this.tileAt(row,col + 1).null()){
                    hasCross = true;
                }
            }
            if(col > 0){
                if(!this.tileAt(row,col - 1).null()){
                    hasCross = true;
                }
            }
        }
        if(!hasCross){
            return 0;
        }
        totalScore += this.getCrossScore(row,col,horizontal);
        return totalScore * mul;
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