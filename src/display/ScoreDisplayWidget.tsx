import React from "react";
import Player from "../logic/Player";

type State = {
    player1: Player,
    player2: Player
}

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
                    <p id="player1Score">{this.state.player1.name + " " + this.state.player1.score}</p>
                    <p id="player2Score">{this.state.player2.name + " " + this.state.player2.score}</p>
                </div>
            </>
        );
    }
}