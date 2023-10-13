import React from "react";
import Player from "../logic/Player";
import "../../public/stylesheets/ScoreDisplayWidget.css"

export default class ScoreDisplayWidget extends React.Component{

    state = {
        player1: new Player(),
        player2: new Player()
    }
    constructor(props: any){
        super(props);
    }
    render(){
        return (
            <>
                <div className="scoreDisplayDiv">
                    <div id="player1ScoreDiv">
                        <p id="player1Name">{this.state.player1.name}</p>
                        <p id="player1Score">{this.state.player1.score}</p>
                    </div>
                    <div id="player2ScoreDiv">
                        <p id="player2Name">{this.state.player2.name}</p>
                        <p id="player2Score">{this.state.player2.score}</p>
                    </div>
                </div>
            </>
        );
    }
}