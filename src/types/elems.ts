export interface StateData {
    id: number;
    x: number;
    y: number;
    label: string;
}

export interface TransitionData {
    id: number;
    from: number;
    to: number;
    read: string[];
    write: string | null;
    move: string;
    curveX: number;
    curveY: number;
}

export interface TestData {
    stateId: number;
    tape: string[];
    pointer: number;
    step: number;
    maxStep: number;
}
