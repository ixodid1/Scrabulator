import Player, { PlayerType } from "./Player.tsx";
import Bag from "./Bag.tsx";
import Board from "./Board.tsx";
import Move, {MoveType} from "./Move.tsx";
import Letter from "./Letter.tsx";
import Word from "./Word.tsx";
import Rack, { rackFromString } from "./Rack.tsx";
// import { getBestMove } from "../wasm/WASMUtil.tsx";
import { GameVariant } from "./Constants.tsx";

export default class Game{
    bag: Bag = new Bag();
    board: Board  = new Board();

    player1: Player = new Player();
    player2: Player = new Player();
    ended: boolean = false;
    playerTurn: boolean = true;

    scorelessTurns: number = 0;

    historyList: GameHistoryEntry[];

    gamestateChangedCallback: () => void;

    constructor(callback: () => void, variant: GameVariant = GameVariant.OMGWords) {
        this.gamestateChangedCallback = callback;
        this.board = new Board(variant);
        this.player1.name = "You";
        this.player2.name = "Nigel Richards";
        this.player2.type = PlayerType.Computer;
        this.player1.rack.drawTiles(this.bag,true);
        this.player2.rack.drawTiles(this.bag,true);

        this.historyList = Array<GameHistoryEntry>();
    }

    currentScore = (): number => {
        return this.playerTurn ? this.player1.score : this.player2.score;
    }
    currentPlayer = (): Player => {
        return this.playerTurn ? this.player1 : this.player2;
    }

    floatingMove = (move: Move): boolean => {
        for(let i = 0; i < move.word.count(); i++){
            let r = move.horizontal ? move.row : move.row + i;
            let c = move.horizontal ? move.column + i : move.column;
            if(r == Math.floor(this.board.dim / 2) && c == Math.floor(this.board.dim / 2)){
                return false;
            }
            if(!move.word.letters[i].newTile){
                return false;
            }
            if(move.horizontal){
                if(r < (this.board.dim - 1)){
                    if(!this.board.tileAt(r + 1,c).null()){
                        return false;
                    }
                }
                if(r > 0){
                    if(!this.board.tileAt(r - 1,c).null()){
                        return false;
                    }
                }
            }else{
                if(c < (this.board.dim - 1)){
                    if(!this.board.tileAt(r,c + 1).null()){
                        return false;
                    }
                }
                if(c > 0){
                    if(!this.board.tileAt(r,c - 1).null()){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    handlePlaceMove = (move: Move): boolean => {
        let copy: Rack = this.currentPlayer().rack.clone();
        for(let letter of move.word.letters){
            let idx = letter.blank ? 26 : letter.idx;
            if(letter.newTile){
                if(copy.hasTile(idx)){
                    copy.removeTile(idx);
                }else{
                    console.log("Move is not playable: not enough tiles " + move.formattedString());
                    return false;
                }
            }
        }
        if(this.floatingMove(move)){
            console.log("Move is not playable: floating move " + move.formattedString());
            return false;
        }
        this.scorelessTurns = 0;
        this.board.playMove(move);
        this.currentPlayer().score += move.score;

        this.historyList.push({board: this.board, move: move, player1: new Player(this.player1.name,this.player1.score,this.player1.rack,this.player1.type), player2: new Player(this.player2.name,this.player2.score,this.player2.rack,this.player2.type), turn: this.playerTurn});

        this.currentPlayer().rack = copy;
        return true;
    }
    handle6Pass = () => {

    }
    handleGameEnd = () => {

    }

    playMove = (move: Move): boolean => {
        console.log("playmove called");
        if(move.type == MoveType.Place){
            let valid:boolean = this.handlePlaceMove(move);
            if(valid){
                this.currentPlayer().rack.drawTiles(this.bag,true);
                if(this.currentPlayer().rack.empty()){
                    this.handleGameEnd();
                }
            }else{
                return false;
            }
        }else if(move.type == MoveType.Exchange){

        }
        if(this.scorelessTurns >= 6){
            this.handle6Pass();
        }
        this.playerTurn = !this.playerTurn;
        this.computerMove();

        this.gamestateChangedCallback();


        return false;
    }
    playMoveFromTyping = (tiles: Letter[], movePositions: number[],row: number, col: number, horizontal: boolean): void => {
        let word:Word = new Word();
        let moveHorizontal = horizontal;
        let moveR = row;
        let moveC = col;
        let fix = true;
        let buffer:Letter[] = [];
        if(moveHorizontal){
            if(col < (this.board.dim - 1)){
                if(!this.board.tileAt(row,col + 1).null()){
                    fix =  false;
                }
            }
            if(col > 0){
                if(!this.board.tileAt(row,col - 1).null()){
                    fix =  false;
                }
            }
        }else{
            if(row < (this.board.dim - 1)){
                if(!this.board.tileAt(row + 1,col).null()){
                    fix = false;
                }
            }
            if(row > 0){
                if(!this.board.tileAt(row - 1,col).null()){
                    fix =  false;
                }
            }
        }
        if(fix && tiles.length == 1){
            moveHorizontal = !moveHorizontal;
        }
        buffer.push(tiles[0]);
        let tilesPos = 1;

        let newR = moveHorizontal ? row : row - 1;
        let newC = moveHorizontal ? col - 1 : col;

        while(newC >= 0 && newR >= 0 && !this.board.tileAt(newR,newC).null()){
            let cur1 = this.board.tileAt(newR,newC);
            buffer.unshift(new Letter(cur1.idx,this.board.isBlank(newR,newC),false));
            if(moveHorizontal){
                newC--;
            }else{
                newR--;
            }
        }
        moveR = moveHorizontal ? row : newR + 1;
        moveC = moveHorizontal ? newC + 1 : col;

        newR = moveHorizontal ? row : row + 1;
        newC = moveHorizontal ? col + 1 : col;

        if(movePositions.length > 1){
            for(let i = movePositions[0]; i < movePositions[movePositions.length - 1]; i++){
                let cur = this.board.tileAt(newR,newC);
                if(!cur.null()){
                    buffer.push(new Letter(cur.idx,this.board.isBlank(newR,newC),false));
                }else{
                    buffer.push(new Letter(tiles[tilesPos].idx,tiles[tilesPos].blank,true));
                    tilesPos++;
                }
                if(moveHorizontal){
                    newC++;
                }else{
                    newR++;
                }
            }
        }
        while(newC < this.board.dim && newR < this.board.dim && !this.board.tileAt(newR,newC).null()){
            let cur1 = this.board.tileAt(newR,newC);
            buffer.push(new Letter(cur1.idx,this.board.isBlank(newR,newC),false));
            if(moveHorizontal){
                newC++;
            }else{
                newR++;
            }
        }
        for(let l of buffer){
            word.add(l);
        }
        let move: Move = new Move(word,moveR,moveC,moveHorizontal,MoveType.Place,0);
        move.score = this.board.calcScore(move);

        this.playMove(move);
    }
    computerMove = () => {
        if(this.currentPlayer().type == PlayerType.Computer){
            // let move = getBestMove(this.board,this.bag,this.currentPlayer().rack);
            // this.playMove(move);
        }
    }
}

export interface GameHistoryEntry{
    board: Board;
    turn: boolean;
    move: Move;
    player1: Player;
    player2: Player;
}