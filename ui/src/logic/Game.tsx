import Player from "./Player.tsx";
import Bag from "./Bag.tsx";
import Board from "./Board.tsx";
import Move, {MoveType} from "./Move.tsx";

export default class Game{
    bag: Bag = new Bag();
    board: Board = new Board();

    player1: Player = new Player();
    player2: Player = new Player();
    ended: boolean = false;
    playerTurn: boolean = true;

    scorelessTurns: number = 0;

    constructor() {
    }

    currentScore = (): number => {
        return this.playerTurn ? this.player1.score : this.player2.score;
    }
    //reference?
    currentPlayer = (): Player => {
        return this.playerTurn ? this.player1 : this.player2;
    }

    playMove = (move: Move): boolean => {
        if(move.type == MoveType.Place){

        }else if(move.type == MoveType.Exchange){

        }
        return false;
    }



}