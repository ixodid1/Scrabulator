//TODO replace by dedicated config classes

export const specialSquares: number[] = 
   [4,0,0,1,0,0,0,4,0,0,0,1,0,0,4,
    0,3,0,0,0,2,0,0,0,2,0,0,0,3,0,
    0,0,3,0,0,0,1,0,1,0,0,0,3,0,0,
    1,0,0,3,0,0,0,1,0,0,0,3,0,0,1,
    0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,
    0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,
    0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,
    4,0,0,1,0,0,0,3,0,0,0,1,0,0,4,
    0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,
    0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,
    0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,
    1,0,0,3,0,0,0,1,0,0,0,3,0,0,1,
    0,0,3,0,0,0,1,0,1,0,0,0,3,0,0,
    0,3,0,0,0,2,0,0,0,2,0,0,0,3,0,
    4,0,0,1,0,0,0,4,0,0,0,1,0,0,4];

export const baseTileCounts: number[] = [9,2,2,4,12,2,3,2,9,1,1,4,2,6,8,2,1,6,4,6,4,2,2,1,2,1,2];
export const tileValues: number[] = [1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10,0];

export const tileSize = 48;

export function getColor(pos: number) : string {
    var num = specialSquares[pos];
    if(num == 1){
        return "#8cc13f";
        // return "#92e5f4";
    }
    if(num == 2){
        return "#557ca3";
        // return "#0080c5";
    }
    if(num == 3){
        return "#da5d51";
        // return "#ff6351";
    }
    if(num == 4){
        return "#efad4d";
        // return "#ff8e09";
    }
    return "white";
}