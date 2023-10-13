import React from "react";
import Move from "../logic/Move";
import "../../public/stylesheets/MoveHistoryWidget.css"
import { GameHistoryEntry } from "../logic/Game";
import Player from "../logic/Player";

type State = {
    moveList: GameHistoryEntry[]
}
export default class MoveHistoryWidget extends React.Component{

    state: State = {
        moveList: []
    }
    constructor(props: any){
        super(props);
    }

    render(){
        return (
            <>
            <div className="moveHistoryDiv">
                <ul>
                {this.state.moveList.map((component,idx) => {
                    return (
                    <li>
                        <div id="moveHistoryEntry" key={idx}>
                        <p id="moveHistoryEntryName">{component.turn ? component.player1.name : component.player2.name}</p>
                        <p id="moveString">{component.move.formattedString()}</p>
                        <div id="scoreDiv">
                            <p id="moveScore">{component.move.score}/</p>
                            <p id="totalScore">{component.turn ? component.player1.score : component.player2.score}</p>
                        </div>
                        </div>
                    </li>
                    )
                })}
                </ul>
            </div>
            </>
        );
    }
}