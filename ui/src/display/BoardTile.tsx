import React, { useEffect, useState, createRef, useRef, RefObject } from "react";
import {getColor, tileValues} from "../logic/Constants.tsx";
import { tileSize } from "../logic/Constants.tsx";
import arrow_right from "../assets/arrow-right-33.svg";
import arrow_down from "../assets/arrow-down-33.svg";

import "../../public/stylesheets/BoardTile.css"
import {render} from "react-dom";

type Props = {
    currentSelected?: number
    tileNum: number
    tileClickedCallback: (int: number) => void
}
interface IState{
    selected: number,
    isBlank: boolean,
    letter: string,
    played: boolean,
    myRef: RefObject<HTMLDivElement>
}

export default class BoardTile extends React.Component<Props, IState>{

    state: IState = {
        selected: 0,
        isBlank: false,
        letter: "",
        played: false,
        myRef: createRef<HTMLDivElement>()
    }
    constructor(props: Props){
        super(props);
    }
    render(){
        let letterColor:string = this.state.isBlank ? "#8c2d36" : "white";
        let myColor: string = getColor(this.props.tileNum);
        let squareSize: string = (tileSize - 2) + "px";
        let size: string = tileSize + "px";
        let pointValue = 0;
        if(this.state.letter != "" && !this.state.isBlank){
            pointValue = tileValues[this.state.letter.charCodeAt(0) - 97];
        }
        return (
            <>
                <div className={"tileDiv" + this.props.tileNum} onClick={() => this.props.tileClickedCallback(this.props.tileNum)} style={{width: size, height:size}}>
                    <div id="tileSquare" style={{width: squareSize, height: squareSize, backgroundColor: myColor}}></div>
                    {this.state.selected == 1 && <img src={arrow_right} width={size} height={size} />}
                    {this.state.selected == 2 && <img src={arrow_down} width={size} height={size} />}
                    {(this.state.letter != "") ? (<div id="tileBackground" style={{width: squareSize, height: squareSize}}></div>) : null}
                    {(this.state.isBlank) ? (<div id="blankBackground"></div>) : null}

                    {(this.state.letter != "") ? (<p id="tileLetter" style={{width: size, height: size, color:letterColor}}>{this.state.letter.toUpperCase()}</p>) : null}
                    {(this.state.letter != "" && !this.state.isBlank) ? (<p id="tileValue">{pointValue}</p>) : null}

                    {/*<canvas ref={this.state.myRef} width={tileSize + "px"}></canvas>*/}
                </div>
            </>
        );
    }
}
