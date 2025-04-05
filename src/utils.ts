import { StateData, TransitionData } from "./types/elems";

function getById(list: StateData[], id: number): StateData | null;
function getById(list: TransitionData[], id: number): TransitionData | null;

function getById(list: any[], id: number) : any | null {
    return list.find((elem) => elem.id === id);
}

function euclid(x1: number, y1: number, x2: number, y2: number) : number {
    return Math.hypot(x1-x2, y1-y2);
}

export {
    getById,
    euclid
}