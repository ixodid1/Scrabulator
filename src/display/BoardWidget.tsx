import "../../public/stylesheets/BoardWidget.css"
import BoardTile from "./BoardTile.tsx";
import React, {RefObject} from "react";
import { ReactNode } from "react";
import { tileSize } from "../logic/Constants.tsx";
import Letter from "../logic/Letter.tsx";
import Rack from "../logic/Rack.tsx";
import Board from "../logic/Board.tsx";

type State = {
    selectedTileIdx: number
    candidatePos: number
    candidateTiles: Letter[]
    candidateTileFreq: number[]
    candidateHorizontal: boolean
    candidateRow: number
    candidateColumn: number
    candidateMovePositions: number[]
    board: Board
    rack: Rack
}
type Props = {
    movePlayCallback: (tiles: Letter[], movePositions: number[],row: number, col: number, horizontal: boolean) => void;
    dimension: number
    initialBoard: Board
}

export default class BoardWidget extends React.Component<Props>{


    state: State = {
        selectedTileIdx: -1,
        candidatePos: 0,
        candidateTiles: [],
        candidateTileFreq: [],
        candidateHorizontal: true,
        candidateRow: -1,
        candidateColumn: -1,
        candidateMovePositions: [],
        board: new Board(),
        rack: new Rack()
    }

    constructor(props: Props){
        super(props);
        window.addEventListener("keydown", this.handleKey);
        this.state.board = this.props.initialBoard;
        for(var i = 0; i < (this.props.dimension * this.props.dimension); i++){
            this.tileRefs[i] = React.createRef<BoardTile>();
            this.tiles[i] = <BoardTile key={i} tileNum={i} tileClickedCallback={this.tileClicked} ref={this.tileRefs[i]} specialSquare={this.state.board.specialSquares[i]} />;
        }
        for(let i = 0; i < 27; i++){ 
            this.state.candidateTileFreq.push(0);
        }
    }
    tiles: ReactNode[] = [];
    tileRefs: RefObject<BoardTile>[] = [];
    render(){
        return (
            <>
                <div className="boardContainer" style={{width: tileSize * this.state.board.dim, height: tileSize * this.state.board.dim}}>
                    {this.tiles.map(component => {
                        return component;
                    })}
                </div>
            </>
        )
    }
    handleKey = (event: KeyboardEvent) => {
        let lowercase: boolean = false;
        let uppercase: boolean = false;
        let validKey: boolean = false;
        if(event.key.length == 1){
            lowercase = (event.key.charCodeAt(0) >= 97 && event.key.charCodeAt(0) <= 122);
            uppercase = (event.key.charCodeAt(0) >= 65 && event.key.charCodeAt(0) <= 90);
            validKey = uppercase || lowercase;
        }
        if(validKey){
            let keyCode: number = event.key.charCodeAt(0);
            if(uppercase){
                keyCode += 32;
            }
            if(this.state.selectedTileIdx != -1){
                if(this.tileRefs[this.state.selectedTileIdx].current == null){
                    return;
                }
                let selectedTile: RefObject<BoardTile> = this.tileRefs[this.state.selectedTileIdx];
                var prevSelected:number = this.tileRefs[this.state.selectedTileIdx].current!.state.selected;

                //number is floating point
                let r:number = Math.floor(this.state.selectedTileIdx / this.state.board.dim);
                let c:number = this.state.selectedTileIdx % this.state.board.dim;

                selectedTile.current!.state.letter.idx = keyCode - 97;
                selectedTile.current!.state.played = true;

                let blank = false;
                if(this.state.candidateTileFreq[keyCode - 97] > 0){
                    this.state.candidateTileFreq[keyCode - 97]--;
                }else{
                    if(this.state.candidateTileFreq[26] > 0){
                        this.state.candidateTileFreq[26]--;
                        blank = true;
                    }
                }
                if(this.state.candidateTiles.length == 0){
                    this.state.candidateRow = r;
                    this.state.candidateColumn = c;
                    if(prevSelected == 2){
                        this.state.candidateHorizontal = false;
                    }
                    if(prevSelected == 1){
                        this.state.candidateHorizontal = true;
                    }
                }
                selectedTile.current!.state.isBlank = uppercase || blank;

                this.state.candidateTiles.push(new Letter(keyCode - 97,blank,true));
                let a = this.state.candidateHorizontal ? c : r;
                this.state.candidateMovePositions.push(a);

                selectedTile.current!.state.selected = 0;
                selectedTile.current!.forceUpdate();

                if((c == (this.state.board.dim - 1) && prevSelected == 1) || (r == (this.state.board.dim - 1) && prevSelected == 2)){
                    selectedTile.current!.state.selected = 0;
                    selectedTile.current!.forceUpdate();
                    this.state.selectedTileIdx = -1;
                    return;
                }
                if(r < this.state.board.dim && r >= 0 && c < this.state.board.dim && c >= 0){
                    if(prevSelected == 1){
                        c++;
                        while(c < this.state.board.dim && this.tileRefs[c + (this.state.board.dim * r)].current!.state.letter.idx != -1){
                            c++;
                        }
                        if(c > (this.state.board.dim - 1)){
                            selectedTile.current!.state.selected = 0;
                            selectedTile.current!.forceUpdate();
                            this.state.selectedTileIdx = -1;
                            return;
                        }
                    }
                    if(prevSelected == 2){
                        r++;
                        while(r < this.state.board.dim && this.tileRefs[c + (this.state.board.dim * r)].current!.state.letter.idx != -1){
                            r++;
                        }
                        if(r > (this.state.board.dim - 1)){
                            selectedTile.current!.state.selected = 0;
                            selectedTile.current!.forceUpdate();
                            this.state.selectedTileIdx = -1;
                            return;
                        }
                    }
                }else{
                    selectedTile.current!.state.selected = 0;
                }
                this.state.selectedTileIdx = (c + (this.state.board.dim * r));
                this.tileRefs[this.state.selectedTileIdx].current!.state.selected = prevSelected;
                this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();
            }
        }else if (event.key == "Backspace"){
            if(this.state.candidateTiles.length > 0){
                let pos = this.state.candidateTiles.length - 1;
                let r = this.state.candidateHorizontal ? this.state.candidateRow : this.state.candidateMovePositions[this.state.candidateMovePositions.length - 1];
                let c = this.state.candidateHorizontal ? this.state.candidateMovePositions[this.state.candidateMovePositions.length - 1] : this.state.candidateColumn;
                if(this.state.selectedTileIdx == -1){
                    if(this.state.candidateTiles[this.state.candidateTiles.length - 1].blank && this.state.candidateTileFreq[26] < this.state.rack.freqMap[26]){
                        this.state.candidateTileFreq[26]++;
                    }else if(this.state.candidateTileFreq[this.state.candidateTiles[this.state.candidateTiles.length - 1].idx] < this.state.rack.freqMap[this.state.candidateTiles[this.state.candidateTiles.length - 1].idx]){
                        this.state.candidateTileFreq[this.state.candidateTiles[this.state.candidateTiles.length - 1].idx]++;
                    }
                    this.state.candidateTiles.length--;
                    this.state.selectedTileIdx = (c + (this.state.board.dim * r));
                    this.tileRefs[this.state.selectedTileIdx].current!.state.letter.idx = -1;
                    this.tileRefs[this.state.selectedTileIdx].current!.state.isBlank = false;
                    this.tileRefs[this.state.selectedTileIdx].current!.state.selected = this.state.candidateHorizontal ? 1 : 2;
                    this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();
                    this.state.candidateMovePositions.length--;

                }else if(pos >= 0){
                    let prevSelected: number = this.tileRefs[this.state.selectedTileIdx].current!.state.selected;

                    if(this.state.candidateTiles[this.state.candidateTiles.length - 1].blank && this.state.candidateTileFreq[26] < this.state.rack.freqMap[26]){
                        this.state.candidateTileFreq[26]++;
                    }else if(this.state.candidateTileFreq[this.state.candidateTiles[this.state.candidateTiles.length - 1].idx] < this.state.rack.freqMap[this.state.candidateTiles[this.state.candidateTiles.length - 1].idx]){
                        this.state.candidateTileFreq[this.state.candidateTiles[this.state.candidateTiles.length - 1].idx]++;
                    }
                    this.state.candidateTiles.length--;
                    this.tileRefs[this.state.selectedTileIdx].current!.state.selected = 0;
                    this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();


                    this.state.selectedTileIdx = (c + (this.state.board.dim * r));

                    this.tileRefs[this.state.selectedTileIdx].current!.state.letter.idx = -1;
                    this.tileRefs[this.state.selectedTileIdx].current!.state.isBlank = false;

                    this.tileRefs[this.state.selectedTileIdx].current!.state.selected = prevSelected;
                    this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();
                    this.state.candidateMovePositions.length--;
                
                }

            }
        }else if(event.key == "Enter"){
            if(this.state.candidateTiles.length > 0){
                this.props.movePlayCallback(this.state.candidateTiles,this.state.candidateMovePositions,this.state.candidateRow,this.state.candidateColumn,this.state.candidateHorizontal);
                this.resetToBoard(true);
            }
        }
    }
    resetToBoard = (hard: boolean) => {
        this.state.candidateTiles.length = 0;
        this.state.candidateMovePositions.length = 0;
        if(hard){
            if(this.state.selectedTileIdx != -1){
                this.tileRefs[this.state.selectedTileIdx].current!.state.selected = 0;
                this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();
                this.state.selectedTileIdx = -1;
            }
        }
        for(let i = 0; i < this.state.candidateTileFreq.length; i++){
            this.state.candidateTileFreq[i] = this.state.rack.freqMap[i];
        }

        
        for(var i = 0; i < (this.state.board.dim * this.state.board.dim); i++){
            if(this.tileRefs[i].current!.state.played){
                this.tileRefs[i].current!.state.letter.idx = -1;
                this.tileRefs[i].current!.state.played = false;
                this.tileRefs[i].current!.state.isBlank = false;
                this.tileRefs[i].current!.forceUpdate();
            }
        }
        for(let r = 0; r < this.state.board.dim; r++){
            for(let c = 0; c < this.state.board.dim; c++){
                let idx = c + (this.state.board.dim * r);
                if(this.tileRefs[idx].current!.state.letter.idx != this.state.board.tileAt(r,c).idx){
                    this.tileRefs[idx].current!.state.letter.idx = this.state.board.tileAt(r,c).idx;
                    this.tileRefs[idx].current!.state.played = false;
                    this.tileRefs[idx].current!.state.isBlank = this.state.board.isBlank(r,c);
                    this.tileRefs[idx].current!.forceUpdate();
                }
            }
        }
    }
    tileClicked = (tileNum: number): void => {
        this.resetToBoard(false);
        let prev = this.state.selectedTileIdx;
        if(prev != tileNum && prev != -1){
            if(this.tileRefs[prev].current != null){
                this.tileRefs[prev].current!.state.selected = 0;
                this.tileRefs[prev].current!.forceUpdate();
            }
        }
        if(this.tileRefs[tileNum].current != null){
            let prevSelected = this.tileRefs[tileNum].current!.state.selected;
            if(prevSelected == 2){
                prevSelected = 0;
            }else{
                prevSelected++;
            }
            this.tileRefs[tileNum].current!.state.selected = prevSelected;
            this.tileRefs[tileNum].current!.forceUpdate();
        }
        this.state.selectedTileIdx = tileNum;
    }
}