import React from "react";
import BoardWidget from "../display/BoardWidget";
import RackWidget from "../display/RackWidget";
import Rack from "../logic/Rack";
import "../../public/stylesheets/GamePage.css"
import Letter from "../logic/Letter";
import Game from "../logic/Game";

type State = {
    game: Game;
}

export default class GamePage extends React.Component{
    gameUpdateCallback = () => {
        
    }

    state = {
        game: new Game(this.gameUpdateCallback)
    }

    constructor(props: any){
        super(props);
    }
    rackExchangeCallback = (exTiles: string) => {
        console.log("extiles " + exTiles);
    }
    boardPlayCallback = (tiles: Letter[], movePositions: number[],row: number, col: number, horizontal: boolean) => {
        console.log(row);
        this.state.game.playMoveFromTyping(tiles,movePositions,row,col,horizontal);
    }
    
    render(){
        return (
            <>
                <div className="gamePageDiv">
                    <div id="boardAndRackDiv">
                    <BoardWidget movePlayCallback={this.boardPlayCallback} />
                    <RackWidget maxRackTiles={7} exchangeCallback={this.rackExchangeCallback}></RackWidget>
                    </div>
                </div>
            </>
        );
    }
}