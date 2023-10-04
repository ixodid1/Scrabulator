import React from "react"
import { tileSize, tileValues } from "../logic/Constants";
import "../../public/stylesheets/RackTile.css"

// type State = {
//     letter: number
// }
type Props = {
    letter:number
    pos: number
    dragStartCallback: (e:React.DragEvent<HTMLDivElement>,pos: number) => void
    dragEnterCallback: (e:React.DragEvent<HTMLDivElement>,pos: number) => void
    dragEndCallback: () => void
}
export default class RackTile extends React.Component<Props>{

    constructor(props:Props){
        super(props);
    }
    render(){
        let size: string = tileSize + "px";
        let squareSize: string = (tileSize - 2) + "px";
        let displayLetter:string = this.props.letter == 26 ? "?" : String.fromCharCode(this.props.letter + 65).toUpperCase();
        let pointValue = 0;
        if(this.props.letter != -1 && !(this.props.letter == 26)){
            pointValue = tileValues[this.props.letter];
        }
        return(
            <>
                <div id="rackTileDiv" style={{width: size, height:size}} onDragStart={(e: React.DragEvent<HTMLDivElement>) => this.props.dragStartCallback(e,this.props.pos)} onDragEnter={(e: React.DragEvent<HTMLDivElement>) => this.props.dragEnterCallback(e,this.props.pos)} onDragEnd={this.props.dragEndCallback} draggable>
                    <div id="rackTileBackground" style={{width: squareSize, height: squareSize}}></div>
                    {(this.props.letter != -1) ? (<p id="rackTileLetter" style={{width: size, height: size, color:"white"}}>{displayLetter}</p>) : null}
                    {(this.props.letter != -1 && !(this.props.letter == 26)) ? (<p id="rackTileValue">{pointValue}</p>) : null}


                </div>
            </>
        )
    }
}