import Bag from "../logic/Bag.js";
import Board from "../logic/Board.js";
import { GameVariant } from "../logic/Constants.js";
import Letter from "../logic/Letter.js";
import Move, { MoveType } from "../logic/Move.js";
import Rack from "../logic/Rack.js";
// @ts-ignore
import Module from "./scrabulator.js";

var myModule: Module;

let kwgLoaded: boolean = false;

export function loadKWG(kwg: string){
    if(kwgLoaded){
        return;
    }
    const req = new Request("kwg/" + kwg + ".kwg");
  
    fetch(req)
    .then((response) => response.blob())
    .then(async (myBlob) => {
      console.log(myBlob.size);
      const arr: Uint32Array = new Uint32Array(await myBlob.arrayBuffer());
      console.log(arr.length);
  
      var space: number = myModule._malloc(arr.length * arr.BYTES_PER_ELEMENT);
      console.log(space);
      myModule.HEAPU32.set(arr,space >> 2);
  
      myModule.ScrabbleUtil_addLexicon(kwg,space,arr.length);
  
      myModule._free(space);
      kwgLoaded = true;
    });
}

export function loadWASMmodule(){
    if(myModule == null){
        new Module().then((mod: any) => {
          myModule = mod;
          mod.ScrabbleUtil_init();
        })

    };
}
export function isValidWord(word: string) : boolean {
    return myModule.ScrabbleUtil_isValidWord(word);
}

export function getBestMove(gameBoard: Board, gameBag: Bag, gameRack: Rack) : Move {
    myModule.ScrabbleUtil_changeBoardConfig(gameBoard.variant.toString());
    let temp = new Move();

    var board = new myModule.Board();
    for(let r = 0; r < gameBoard.dim; r++){
        for(let c = 0; c < gameBoard.dim; c++){
            board.setLetter(gameBoard.tileAt(r,c).idx,gameBoard.isBlank(r,c),r,c);
        }
    }    
    board.recalcAnchorSquares();
    board.recalcCrossSets();

    var rack = new myModule.Rack();
    for(let i = 0; i < 27; i++){
        for(let k = 0; k < gameRack.freqMap[i]; k++){
            rack.addTile(i);
        }
    }
    // console.log("movegen rack " + rack.toString());
    var movegen = new myModule.MoveGenerator(board);

    movegen.setLimit(5);
    var vec = movegen.generateMoves(rack,false);
    // for(var i = 0; i < vec.size(); i++){
    //   console.log(vec.get(i).formattedString() + " " + vec.get(i).score + "\n");
    // }
    if(vec.size() > 0){
        for(let i = 0; i < vec.get(0).word.count(); i++){
            let l = vec.get(0).word.letterAt(i);
            let newTile = false;
            let blank = false;
            if(((l >> 5) & 1) > 0){
                newTile = true;
            }
            if(((l >> 6) & 1) > 0){
                blank = true;
            }
            let letterIdx = (l & 0x1f) - 1;
            temp.word.add(new Letter(letterIdx,blank,newTile));
        }
        temp.row = vec.get(0).r;
        temp.column = vec.get(0).c;
    
        if(vec.get(0).type == myModule.MoveType.Place){
            temp.type = MoveType.Place;
        }else if(vec.get(0).type == myModule.MoveType.Exchange){
            temp.type = MoveType.Exchange;
        }
        temp.score = vec.get(0).score;
        temp.horizontal = vec.get(0).horizontal;
    }

    rack.delete();
    movegen.delete();
    board.delete();


    return temp;
}