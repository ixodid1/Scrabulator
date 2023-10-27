import React, {RefObject} from "react";
import BoardWidget from "../display/BoardWidget";
import RackWidget from "../display/RackWidget";
import Rack from "../logic/Rack";
import "../../public/stylesheets/GamePage.css"
import Letter from "../logic/Letter";
import Game from "../logic/Game";
import ScoreDisplayWidget from "../display/ScoreDisplayWidget";
import { GameVariant } from "../logic/Constants";
import MoveHistoryWidget from "../display/MoveHistoryWidget";

// type State = {
//     game: Game;
// }

type Props = {
    variant: GameVariant
}

export default class GamePage extends React.Component<Props>{
    gameUpdateCallback = () => {
        // this.forceUpdate();
        this.state.rackWidgetRef.current!.updateRack(this.state.game.currentPlayer().rack);

        this.state.boardWidgetRef.current!.state.board = this.state.game.board;
        this.state.boardWidgetRef.current!.state.rack = this.state.game.currentPlayer().rack;
        this.state.boardWidgetRef.current!.resetToBoard(true);

        this.state.scoreDisplayRef.current!.state.player1 = this.state.game.player1;
        this.state.scoreDisplayRef.current!.state.player2 = this.state.game.player2;
        this.state.scoreDisplayRef.current!.forceUpdate();

        this.state.moveHistoryRef.current!.state.moveList = this.state.game.historyList;
        this.state.moveHistoryRef.current!.forceUpdate();

    }

    state = {
        game: new Game(this.gameUpdateCallback),
        rackWidgetRef: React.createRef<RackWidget>(),
        boardWidgetRef: React.createRef<BoardWidget>(),
        scoreDisplayRef: React.createRef<ScoreDisplayWidget>(),
        moveHistoryRef: React.createRef<MoveHistoryWidget>()

    }

    constructor(props: Props){
        super(props);
        this.state.game = new Game(this.gameUpdateCallback,this.props.variant);
    }
    rackExchangeCallback = (exTiles: string) => {
        console.log("extiles " + exTiles);
    }
    exchangeFieldClickedCallback = () => {
        this.state.boardWidgetRef.current!.resetToBoard(true);
    }
    boardPlayCallback = (tiles: Letter[], movePositions: number[],row: number, col: number, horizontal: boolean) => {
        this.state.game.playMoveFromTyping(tiles,movePositions,row,col,horizontal);
    }
    componentDidMount(): void {
        this.state.boardWidgetRef.current!.state.board = this.state.game.board;
        this.state.boardWidgetRef.current!.forceUpdate();
        this.gameUpdateCallback();
        // this.state.boardWidgetRef.current!.forceUpdate();
    }
    
    render(){
        let dimension = this.props.variant == GameVariant.ZOMGWords ? 21 : 15;
        return (
            <>
                <div className="gamePageDiv">
                    <div id="boardAndRackDiv">
                    <BoardWidget movePlayCallback={this.boardPlayCallback} ref={this.state.boardWidgetRef} dimension={dimension} initialBoard={this.state.game.board} />
                    <RackWidget maxRackTiles={7} exchangeCallback={this.rackExchangeCallback} exchangeFieldClickedCallback={this.exchangeFieldClickedCallback} ref={this.state.rackWidgetRef} ></RackWidget>
                    </div>

                    <div className="infoDiv">
                        <MoveHistoryWidget ref={this.state.moveHistoryRef}></MoveHistoryWidget>
                        <ScoreDisplayWidget ref={this.state.scoreDisplayRef}/>
                    </div>
                </div>
            </>
        );
    }
}