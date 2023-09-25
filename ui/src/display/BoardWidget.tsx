import "../../public/stylesheets/BoardWidget.css"
import BoardTile from "./BoardTile.tsx";
import React, {RefObject} from "react";
import { ReactNode } from "react";
import { tileSize } from "../logic/Constants.tsx";
import Letter from "../logic/Letter.tsx";
import Rack from "../logic/Rack.tsx";

type State = {
    selectedTileIdx: number
    candidatePos: number
    candidateTiles: Letter[]
    candidateTileFreq: number[]
    candidateHorizontal: boolean
    candidateRow: number
    candidateColumn: number
    candidateMovePositions: number[]
    rack: Rack
}

export default class BoardWidget extends React.Component<State>{


    state: State = {
        selectedTileIdx: -1,
        candidatePos: 0,
        candidateTiles: [],
        candidateTileFreq: [],
        candidateHorizontal: true,
        candidateRow: -1,
        candidateColumn: -1,
        candidateMovePositions: [],
        rack: new Rack()
    }

    constructor(props: any){
        super(props);
        window.addEventListener("keydown", this.handleKey);
        for(var i: number = 0; i < 225; i++){
            this.tileRefs[i] = React.createRef<BoardTile>();
            this.tiles[i] = <BoardTile key={i} tileNum={i} tileClickedCallback={this.tileClicked} ref={this.tileRefs[i]} />;
        }
    }
    tiles: ReactNode[] = [];
    tileRefs: RefObject<BoardTile>[] = [];
    render(){
        return (
            <>
                <div className="boardContainer" style={{width: tileSize * 15, height: tileSize * 15}}>
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
            if(this.state.selectedTileIdx != -1){
                if(this.tileRefs[this.state.selectedTileIdx].current == null){
                    return;
                }
                // console.log("tileidx " +  this.state.selectedTileIdx);
                let selectedTile: RefObject<BoardTile> = this.tileRefs[this.state.selectedTileIdx];
                var prevSelected:number = this.tileRefs[this.state.selectedTileIdx].current!.state.selected;

                //number is floating point
                let r:number = Math.floor(this.state.selectedTileIdx / 15);
                let c:number = this.state.selectedTileIdx % 15;

                //TODO this should never execute
                if(r > 14 || r < 0 || c > 14 || c < 0){
                    console.log("r or c case");
                    return;
                }
                selectedTile.current!.state.letter = String.fromCharCode(keyCode);
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

                this.state.candidateTiles.push(new Letter(keyCode - 96,blank,true));
                let a = this.state.candidateHorizontal ? c : r;
                this.state.candidateMovePositions.push(a);

                selectedTile.current!.state.selected = 0;
                selectedTile.current!.forceUpdate();

                if((c == 14 && prevSelected == 1) || (r == 14 && prevSelected == 2)){
                    selectedTile.current!.state.selected = 0;
                    selectedTile.current!.forceUpdate();
                    this.state.selectedTileIdx = -1;
                    return;
                }
                if(r < 15 && r >= 0 && c < 15 && c >= 0){
                    if(prevSelected == 1){
                        c++;
                        while(c < 15 && this.tileRefs[c + (15 * r)].current!.state.letter != ""){
                            c++;
                        }
                        if(c > 14){
                            selectedTile.current!.state.selected = 0;
                            selectedTile.current!.forceUpdate();
                            this.state.selectedTileIdx = -1;
                            return;
                        }
                    }
                    if(prevSelected == 2){
                        r++;
                        while(r < 15 && this.tileRefs[c + (15 * r)].current!.state.letter != ""){
                            r++;
                        }
                        if(r > 14){
                            selectedTile.current!.state.selected = 0;
                            selectedTile.current!.forceUpdate();
                            this.state.selectedTileIdx = -1;
                            return;
                        }
                    }
                }else{
                    selectedTile.current!.state.selected = 0;
                }
                this.state.selectedTileIdx = (c + (15 * r));
                this.tileRefs[this.state.selectedTileIdx].current!.state.selected = prevSelected;
                this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();
            }
        }else if (event.key == "Backspace"){
            if(this.state.candidateTiles.length > 0){
                let pos = this.state.candidateTiles.length - 1;
                let r = this.state.candidateHorizontal ? this.state.candidateRow : this.state.candidateMovePositions[this.state.candidateMovePositions.length - 1];
                let c = this.state.candidateHorizontal ? this.state.candidateMovePositions[this.state.candidateMovePositions.length - 1] : this.state.candidateColumn;
                if(this.state.selectedTileIdx == -1){
                    if(this.state.candidateTiles[this.state.candidateTiles.length - 1] && this.state.candidateTileFreq[26] < this.state.rack.freqMap[26]){
                        this.state.candidateTileFreq[26]++;
                    }else if(this.state.candidateTileFreq[this.state.candidateTiles.length - 1] < this.state.rack.freqMap[this.state.candidateTiles.length - 1]){
                        this.state.candidateTileFreq[this.state.candidateTiles.length - 1]++;
                    }
                    this.state.candidateTiles.length--;
                    this.state.selectedTileIdx = (c + (15 * r));
                    this.tileRefs[this.state.selectedTileIdx].current!.state.letter = "";
                    this.tileRefs[this.state.selectedTileIdx].current!.state.isBlank = false;
                    this.tileRefs[this.state.selectedTileIdx].current!.state.selected = this.state.candidateHorizontal ? 1 : 2;
                    this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();
                    this.state.candidateMovePositions.length--;

                }else if(pos >= 0){
                    let prevSelected: number = this.tileRefs[this.state.selectedTileIdx].current!.state.selected;

                    if(this.state.candidateTiles[this.state.candidateTiles.length - 1] && this.state.candidateTileFreq[26] < this.state.rack.freqMap[26]){
                        this.state.candidateTileFreq[26]++;
                    }else if(this.state.candidateTileFreq[this.state.candidateTiles.length - 1] < this.state.rack.freqMap[this.state.candidateTiles.length - 1]){
                        this.state.candidateTileFreq[this.state.candidateTiles.length - 1]++;
                    }
                    this.state.candidateTiles.length--;
                    this.tileRefs[this.state.selectedTileIdx].current!.state.selected = 0;
                    this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();


                    this.state.selectedTileIdx = (c + (15 * r));

                    this.tileRefs[this.state.selectedTileIdx].current!.state.letter = "";
                    this.tileRefs[this.state.selectedTileIdx].current!.state.isBlank = false;

                    this.tileRefs[this.state.selectedTileIdx].current!.state.selected = prevSelected;
                    this.tileRefs[this.state.selectedTileIdx].current!.forceUpdate();
                    this.state.candidateMovePositions.length--;
                
                }

            }
        }else if(event.key == "Enter"){
            if(this.state.candidateTiles.length > 0){
                this.resetToBoard(true);
                //TODO play move
            }
        }
    }
    resetToBoard = (hard: boolean) => {
        this.state.candidateTiles.length = 0;
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
        
        for(var i = 0; i < 225; i++){
            if(this.tileRefs[i].current!.state.played){
                this.tileRefs[i].current!.state.letter = "";
                this.tileRefs[i].current!.state.played = false;
                this.tileRefs[i].current!.state.isBlank = false;
                this.tileRefs[i].current!.forceUpdate();
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