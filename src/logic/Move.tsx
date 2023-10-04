import Word from "./Word.tsx";

export const enum MoveType{
    Place = "Place",
    Exchange = "Exchange",
    Phony =  "Phony"
}
class Move{
    row: number = 0;
    column: number = 0;
    type: string = MoveType.Place;
    score: number = 0;
    horizontal: boolean = true;
    word: Word = new Word();


    constructor(word: Word = new Word(), row: number = 0, column: number = 0, horizontal: boolean = true, type: string = MoveType.Place, score: number = 0) {
        this.word = word;
        this.row = row;
        this.column = column;
        this.type = type;
        this.score = score;
        this.horizontal = horizontal;
    }

    formattedCoords = (): string => {
        let temp: string = "";
        temp += this.horizontal ? (this.row + 1) : String.fromCharCode(this.column + 65);
        temp += this.horizontal ? String.fromCharCode(this.column + 65) : (this.row + 1);
        return temp;

    }

    formattedString = (): string => {
        let temp: string = "";
        if(this.type == MoveType.Place){
            temp += this.formattedCoords();
            temp += " ";
            temp += this.word.formattedString();

        }else if(this.type == MoveType.Exchange){
            temp += "Exch. ";
            temp += this.word.formattedString();
        }else if(this.type == MoveType.Phony){

        }
        return temp;
    }


}
export default Move;