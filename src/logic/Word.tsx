import Letter from "./Letter.tsx";
export default class Word {
    letters: Letter[] = [];
    constructor() {
    }
    add = (l: Letter): void => {
        this.letters.push(l);
    }
    count = (): number => {
        return this.letters.length;
    }
    formattedString = (): string => {
        let temp: string = "";
        let flag: boolean = false;
        for(let i = 0; i < this.count(); i++){
            let l = this.letters[i];
            let c: number = l.toCharCode();
            if(l.blank){
                c = c - 32;
            }
            if(!l.newTile){
                if(!flag){
                    temp += '(';
                }
                flag = true;
            }else{
                if(flag){
                    temp += ')';
                    flag = false;
                }
            }
            temp += String.fromCharCode(c);
            if(flag && l.newTile){
                temp += ')';
                flag = false;
            }
        }
        if(flag){
            temp += ')';
        }
        return temp;
    }
    rawString = (): string => {
        let temp: string = "";
        for(let i = 0; i < this.count(); i++){
            let l = this.letters[i];
            temp += String.fromCharCode(l.toCharCode());
        }
        return temp;
    }
}