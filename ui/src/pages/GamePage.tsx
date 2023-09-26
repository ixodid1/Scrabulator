import React from "react";
import BoardWidget from "../display/BoardWidget";
import RackWidget from "../display/RackWidget";
import Rack from "../logic/Rack";
import "../../public/stylesheets/GamePage.css"

export default class GamePage extends React.Component{
    constructor(props: any){
        super(props);
    }
    render(){
        return (
            <>
                <div className="gamePageDiv">
                    <div id="boardAndRackDiv">
                    <BoardWidget selectedTileIdx={-1} candidatePos={0} candidateTiles={[]} candidateTileFreq={[]} candidateHorizontal={false} candidateRow={0} candidateColumn={0} candidateMovePositions={[]} rack={new Rack()} />
                    <RackWidget maxRackTiles={7}></RackWidget>
                    </div>
                </div>
            </>
        );
    }
}