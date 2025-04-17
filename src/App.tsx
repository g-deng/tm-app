import './App.css';
import BuildWindow from './components/BuildWindow';
import TestWindow from './components/TestWindow';
import SideBar from './components/SideBar';
import Tape from './components/Tape';
import { StateData, TransitionData, TestData } from './types/elems';
import { UserAction } from './types/user';
import { useState } from 'react';

function App() {
    const [states, setStates] = useState<StateData[]>([
        { id: 0, x: 100, y: 100, label: 'q0' },
        { id: 1, x: 200, y: 200, label: 'q1' },
    ]);
    const [transitions, setTransitions] = useState<TransitionData[]>([
        {
            id: 2,
            from: 0,
            to: 1,
            read: ['A'],
            write: 'B',
            move: 'R',
            curveX: 0,
            curveY: -30,
        },
    ]);
    const [mode, setMode] = useState<'build' | 'test'>('build');
    const [undoStack, setUndoStack] = useState<UserAction[]>([]); // {action, type, item}
    const [redoStack, setRedoStack] = useState<UserAction[]>([]);
    const [testData, setTestData] = useState<TestData | null>(null); // {stateId, tape, pointer, step, maxStep}

    const props = {
        states,
        setStates,
        transitions,
        setTransitions,
        undoStack,
        setUndoStack,
        redoStack,
        setRedoStack,
        mode,
        setMode,
        testData,
        setTestData,
    };

    return (
        <div className="App">
            <header className="App-header">
                <p>turing machine simulator</p>
            </header>
            <div className="content-container">
                <div className="window-container">
                    {mode === 'build' && (
                        <BuildWindow key="window" {...props} />
                    )}
                    {mode === 'test' && (
                        <TestWindow key="test-window" {...props} />
                    )}
                    <Tape key="tape" states={states} testData={testData} />
                </div>
                <SideBar key="sidebar" {...props} />
            </div>
        </div>
    );
}
export default App;
