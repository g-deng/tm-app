import { StateData, TransitionData, TestData } from './types/elems';
import { UserAction } from './types/user';

export interface AppProps {
    states: StateData[];
    setStates: React.Dispatch<React.SetStateAction<StateData[]>>;
    transitions: TransitionData[];
    setTransitions: React.Dispatch<React.SetStateAction<TransitionData[]>>;
    undoStack: UserAction[];
    setUndoStack: React.Dispatch<React.SetStateAction<UserAction[]>>;
    redoStack: UserAction[];
    setRedoStack: React.Dispatch<React.SetStateAction<UserAction[]>>;
    mode: 'build' | 'test';
    setMode: React.Dispatch<React.SetStateAction<'build' | 'test'>>;
    testData: TestData | null;
    setTestData: React.Dispatch<React.SetStateAction<TestData | null>>;
}
