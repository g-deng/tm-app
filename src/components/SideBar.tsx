import { useState } from 'react';
import { AppProps } from '../App.types';
import { UserAction } from '../types/user';

function SideBar(
    {
        states, setStates, transitions, setTransitions,
        undoStack, setUndoStack, redoStack, setRedoStack,
        mode, setMode, testData, setTestData,
    }: AppProps
) {
    const [status, setStatus] = useState('Testing information not entered');
    const [lastInputTape, setLastInputTape] = useState('ABA');
    const [lastMaxSteps, setLastMaxSteps] = useState(10);

    const undoRedoStacker = (   
        fromStack: UserAction[], 
        setFromStack: React.Dispatch<React.SetStateAction<UserAction[]>>, 
        toStack: UserAction[], 
        setToStack: React.Dispatch<React.SetStateAction<UserAction[]>>
    ) => {
        if (mode !== 'build') return;
        const elem = fromStack.pop();
        console.log(elem);
        if (elem == null || elem.action == null) return;
        switch (elem.action) {
            case 'delete':
                if (elem.type === 'state') {
                    setStates(
                        states.filter((item) => item.id !== elem.item.id),
                    );
                } else if (elem.type === 'transition') {
                    setTransitions(
                        transitions.filter((item) => item.id !== elem.item.id),
                    );
                }
                elem.action = 'create';
                break;
            case 'create':
                if (
                    elem.type === 'state' &&
                    states.find((s) => s.id === elem.item.id) == null
                ) {
                    setStates([...states, elem.item]);
                } else if (elem.type === 'transition') {
                    setTransitions([...transitions, elem.item]);
                }
                elem.action = 'delete';
                break;
            case 'edit':
                if (elem.type === 'state') {
                    const original = states.find((item) => item.id === elem.item.id);
                    setStates([
                        ...states.filter((item) => item.id !== elem.item.id),
                        elem.item,
                    ]);
                    if (original) elem.item = original;
                } else if (elem.type === 'transition') {
                    const original = transitions.find(
                        (item) => item.id === elem.item.id,
                    );
                    setTransitions([
                        ...transitions.filter(
                            (item) => item.id !== elem.item.id,
                        ),
                        elem.item,
                    ]);
                    if (original) elem.item = original;
                }
                break;
            case 'create-multiple':
                setStates([...states, elem.state]);
                setTransitions([...transitions, ...elem.transitions]);
                elem.action = 'delete-multiple';
                break;
            case 'delete-multiple':
                setStates(states.filter((item) => item.id !== elem.state.id));
                if (elem.transitions != null && elem.transitions.length > 0)
                    setTransitions(
                        transitions.filter(
                            (item) =>
                                elem.transitions.find(
                                    (t) => t.id === item.id,
                                ) != null,
                        ),
                    );
                elem.action = 'create-multiple';
                break;
            default:
                break;
        }
        setToStack([...toStack, elem]);
        setFromStack(fromStack);
    };
    const onUndo = () => {
        undoRedoStacker(undoStack, setUndoStack, redoStack, setRedoStack);
    };

    const onRedo = () => {
        undoRedoStacker(redoStack, setRedoStack, undoStack, setUndoStack);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const data = form.elements as typeof form.elements & {
            inputTape: HTMLInputElement;
            maxSteps: HTMLInputElement;
        }
        setTestData({
            stateId: 0,
            tape: data.inputTape.value.split(''),
            pointer: 0,
            step: 0,
            maxStep: Number(data.maxSteps.value),
        });
        setLastInputTape(data.inputTape.value);
        setLastMaxSteps(Number(data.maxSteps.value));
        setStatus('Testing data set');
    };

    const onStep = () => {
        if (testData == null) return;

        const c = testData.tape[testData.pointer];
        const t = transitions.find(
            (t) => t.from === testData.stateId && t.read.includes(c),
        );
        if (t == null) {
            setStatus(
                `Rejected at state ${testData.stateId} (no valid transition)`,
            );
            return;
        }
        if (t.write != null && t.write !== '') {
            testData.tape[testData.pointer] = t.write;
        }
        let newPointer = testData.pointer;
        if (t.move === 'R') {
            newPointer += 1;
        } else {
            newPointer -= 1;
        }

        setTestData({
            stateId: t.to,
            tape: testData.tape,
            pointer: newPointer,
            step: testData.step + 1,
            maxStep: testData.maxStep,
        });
        setStatus(
            `Finished step ${testData.step} at state ${testData.stateId}`,
        );
    };

    const onFastForward = () => {
        if (testData == null) return;
        console.log('start fast forward');
        console.log(testData);
        let pointer = testData.pointer;
        let stateId = testData.stateId;
        let step = testData.step;
        for (let i = step; i < testData.maxStep; i++) {
            const thisId = stateId;
            const c = testData.tape[pointer];
            const t = transitions.find(
                (t) => t.from === thisId && t.read.includes(c),
            );
            if (t == null) {
                setStatus(
                    `Rejected at state ${stateId} after (no valid transition)`,
                );
                break;
            }
            stateId = t.to;
            pointer += 1;
            step += 1;
        }
        testData.stateId = stateId;
        testData.pointer = pointer;
        testData.step = step;
        setTestData(testData);
        console.log('done with fast forward');
        console.log(testData);
    };

    return (
        <div className="sidebar">
            <div
                className={
                    'sidebar-section' +
                    (mode === 'build' ? ' sidebar-active' : '')
                }
                onMouseDown={() => {
                    setMode('build');
                    setTestData(null);
                }}
            >
                build
                <button
                    className="sidebar-btn"
                    title="Undo"
                    onClick={onUndo}
                    disabled={undoStack.length <= 0}
                >
                    Undo
                </button>
                <button
                    className="sidebar-btn"
                    title="Redo"
                    onClick={onRedo}
                    disabled={redoStack.length <= 0}
                >
                    Redo
                </button>
            </div>
            <div
                className={
                    'sidebar-section' +
                    (mode === 'test' ? ' sidebar-active' : '')
                }
                onMouseDown={() => setMode('test')}
            >
                test
                <form onSubmit={onSubmit}>
                    <label>
                        Limit steps:
                        <input
                            className="sidebar-input"
                            name="maxSteps"
                            type="integer"
                            defaultValue={lastMaxSteps}
                        />
                    </label>
                    <label>
                        Input tape:
                        <input
                            className="sidebar-input"
                            name="inputTape"
                            type="string"
                            defaultValue={lastInputTape}
                        />
                    </label>
                    <label>
                        Save test params:
                        <input className="sidebar-btn" type="submit" />
                    </label>
                </form>
                <button
                    className="sidebar-btn"
                    title="Step"
                    onClick={onStep}
                    disabled={testData == null}
                >
                    Step
                </button>
                <button
                    className="sidebar-btn"
                    title="Fast forward"
                    onClick={onFastForward}
                    disabled={testData == null}
                >
                    Fast forward
                </button>
                Status: {status}
            </div>
        </div>
    );
}

export default SideBar;
