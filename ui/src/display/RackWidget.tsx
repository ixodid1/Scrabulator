import React, { ReactNode, RefObject, createRef, useRef } from "react";
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

    render(){
        let size = tileSize + "px";
        let exchangeArrowSize = (tileSize - 15) + "px";
        return (
            <>
                <div className="rackWidgetDiv">
                
                <div id="shuffleButton">
                    <img src={arrow_round} width={size} height={size}></img>
                </div>
                {this.lettersTest.map((component,idx) => {
                        return (
                            <RackTile key={idx} letter={component} pos={idx} dragEnterCallback={this.dragEnter} dragStartCallback={this.dragStart} dragEndCallback={this.drop}></RackTile>
                        )
                    })}
                <div id="exchangeButton">
                    <img id="exchangeButtonImage" src={arrow_left_right} width={exchangeArrowSize} height={exchangeArrowSize}></img>
                </div>
                
                </div>
                
            </>
        );
    }
}