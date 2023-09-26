import React, { KeyboardEventHandler, ReactNode, RefObject, createRef, useRef } from "react";
import RackTile from "./RackTile";
import Rack from "../logic/Rack";
import "../../public/stylesheets/RackWidget.css"
import arrow_round from "../assets/arrow-round-white.svg";
import arrow_left_right from "../assets/arrow-right-left-342.svg";
import { tileSize } from "../logic/Constants";

type State = {
    // dragItem: RefObject<RackTile | null>
    // dragOverItem: RefObject<RackTile | null>
    dragItemIdx: number,
    dragOverItemIdx: number
}

type Props = {
    maxRackTiles: number
    exchangeCallback: (tiles: string) => void;
}

export default class RackWidget extends React.Component<Props,State>{
    
    rackTileWidgets: ReactNode[] = [];
    lettersTest: number[] = [];

    state:State = {
        // dragItem: createRef(),
        // dragOverItem: createRef()
        dragItemIdx: -1,
        dragOverItemIdx: -1
    }

    constructor(props: Props){
        super(props);
        for(var i = 0; i < this.props.maxRackTiles; i++){
            this.lettersTest[i] = i;
            // this.rackTileWidgets[i] = <RackTile key={i} letter={-1} />;
        }
    }
    updateRack(playerRack: Rack){
        
    }
    dragStart = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
        this.state.dragItemIdx = pos;
    }
    dragEnter = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
        this.state.dragOverItemIdx = pos;
    }
    drop = () => {
        if(this.state.dragItemIdx == -1 || this.state.dragOverItemIdx == -1){
            return;
        }
        let listCopy = [...this.lettersTest];
        let curDrag = listCopy[this.state.dragItemIdx];
        listCopy.splice(this.state.dragItemIdx,1);
        listCopy.splice(this.state.dragOverItemIdx,0,curDrag);
        this.state.dragItemIdx = -1;
        this.state.dragOverItemIdx = -1;
        this.lettersTest = listCopy;
        this.forceUpdate();
    }
    shuffleButtonPressed = () => {
        this.shuffleArray(this.lettersTest);
        this.forceUpdate();
    }
    shuffleArray(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    exchangeButtonPressed = () => {
        let elem: HTMLElement | null = document.querySelector(".exchangeInputDiv");
        let prevDisplay:string = elem!.style.display;
        if(prevDisplay == "flex"){
            elem!.style.display = "none";
        }else{
            elem!.style.display = "flex";
            let input: HTMLElement | null = document.getElementById("exchangeInput");
            (input as HTMLInputElement)!.focus();
        }
    }
    handleExchangeKeyEvent = (event: React.KeyboardEvent ) => {
        if(event.key == "Enter"){
            let elem: HTMLElement | null = document.getElementById("exchangeInput");
            let div: HTMLElement | null = document.querySelector(".exchangeInputDiv");

            let text: string = (elem as HTMLInputElement)!.value;
            this.props.exchangeCallback(text);
            (elem as HTMLInputElement)!.value = "";
            div!.style.display = "none";


        }
    }

    render(){
        let size = tileSize + "px";
        let exchangeArrowSize = (tileSize - 15) + "px";
        return (
            <>

                <div className="exchangeInputDiv" style={{display:"none"}}>
                    <p id="exchangeInputText">Exchange:</p>
                    <input id="exchangeInput" onKeyDown={(e: React.KeyboardEvent) => this.handleExchangeKeyEvent(e)}></input>
                </div>
                <div className="rackWidgetDiv">
                
                <div id="exchangeButton" onClick={() => this.exchangeButtonPressed()}>
                    <img src={arrow_round} width={size} height={size}></img>
                </div>
                {this.lettersTest.map((component,idx) => {
                        return (
                            <RackTile key={idx} letter={component} pos={idx} dragEnterCallback={this.dragEnter} dragStartCallback={this.dragStart} dragEndCallback={this.drop}></RackTile>
                        )
                    })}
                <div id="shuffleButton" onClick={() => this.shuffleButtonPressed()}>
                    <img id="shuffleButtonImage" src={arrow_left_right} width={exchangeArrowSize} height={exchangeArrowSize}></img>
                </div>
                
                </div>
                
            </>
        );
    }
}