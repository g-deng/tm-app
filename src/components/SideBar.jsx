import { useState } from 'react';

function SideBar({ 
    mode, setMode, undoStack, setUndoStack, redoStack, setRedoStack,
    states, setStates, transitions, setTransitions, testState, setTestState}) {
    const [status, setStatus] = useState('Testing information not entered');

    const undoRedoStacker = (fromStack, setFromStack, toStack, setToStack) => {
        if (mode !== 'build') return;
        const elem = fromStack.pop();
        console.log(elem);
        if (elem == null || elem.action == null) return;
        switch (elem.action) {
            case 'delete':
                if (elem.type === 'state') {
                    setStates(states.filter(item => item.id !== elem.item.id));
                } else if (elem.type === 'transition') {
                    setTransitions(transitions.filter(item => item.id !== elem.item.id));
                }
                elem.action = 'create';
                break;
            case 'create':
                if (elem.type === 'state' && states.find((s)=>s.id === elem.item.id) == null) {
                    setStates([...states, elem.item]);
                } else if (elem.type === 'transition') {
                    setTransitions([...transitions, elem.item]);
                }
                elem.action = 'delete';
                break;
            case 'edit':
                let original;
                if (elem.type === 'state') {
                    original = states.find((item) => item.id === elem.item.id);
                    setStates([...states.filter((item) => item.id !== elem.item.id), elem.item]);
                } else if (elem.type === 'transition') {
                    original = transitions.find((item) => item.id === elem.item.id);
                    setTransitions([...transitions.filter((item) => item.id !== elem.item.id), elem.item]);
                }
                elem.item = original;
                break;
            case 'create-multiple':
                setStates([...states, elem.state]);
                setTransitions([...transitions, ...elem.transitions]);
                elem.action = 'delete-multiple';
                break;
            case 'delete-multiple':
                setStates(states.filter(item => item.id !== elem.state.id));
                if (elem.transitions != null && elem.transitions.length > 0)
                setTransitions(transitions.filter(item => elem.transitions.find((t)=>t.id===item.id) != null));
                elem.action = 'create-multiple';
                break;
            default:
                break;
        };
        setToStack([...toStack, elem]);
        setFromStack(fromStack);
    }
    const onUndo = () => {
        undoRedoStacker(undoStack, setUndoStack, redoStack, setRedoStack);
    };

    const onRedo = () => {
        undoRedoStacker(redoStack, setRedoStack, undoStack, setUndoStack);
    };

    const onSubmit = (data) => {
        setTestState({stateId:0, tape:data.get("input-tape").split(""), pointer:0, step:0, maxStep:data.get("max-steps")})
        setStatus("Testing data set");
    };

    const onStep = () => {
        const c = testState.tape[testState.pointer];
        const t = transitions.find((t)=>t.from === testState.stateId && t.read.includes(c));
        if (t == null) {
            setStatus(`Rejected at state ${testState.stateId} (no valid transition)`);
            return;
        }
        if (t.write !== null) {
            testState.tape[testState.pointer] = t.write;
        }
        let newPointer = testState.pointer;
        if (t.move === 'R') {
            newPointer += 1;
        } else {
            newPointer -= 1;
        }

        setTestState({stateId:t.to, tape:testState.tape, pointer:newPointer, step:testState.step+1, maxStep:testState.maxStep});
        setStatus(`Finished step ${testState.step} at state ${testState.stateId}`);
    };

    const onFastForward = () => {
        console.log('start fast forward');
        console.log(testState);
        let pointer = testState.pointer;
        let stateId = testState.stateId;
        let step = testState.step;
        for (let i = step; i < testState.maxStep; i++) {
            const thisId = stateId;
            const c = testState.tape.charAt(pointer);
            const t = transitions.find((t)=>t.from === thisId && t.label.charAt(0) === c);
            if (t == null) {
                setStatus(`Rejected at state ${stateId} after (no valid transition)`);
                break;
            }
            stateId = t.to;
            pointer += 1;
            step += 1;
        }
        testState.stateId = stateId;
        testState.pointer = pointer;
        testState.step = step;
        setTestState(testState);
        console.log('done with fast forward');
        console.log(testState);
    };

    return (
        <div className='sidebar'>
            <div 
                className={'sidebar-section' + ((mode === 'build') ? ' sidebar-active' : '')}
                onMouseDown={()=>{setMode('build')}}
            >
                build
               <button className='sidebar-btn' title='Undo' onClick={onUndo} disabled={undoStack.length <= 0}>Undo</button>
               <button className='sidebar-btn' title='Redo' onClick={onRedo} disabled={redoStack.length <= 0}>Redo</button>
            </div>
            <div 
                className={'sidebar-section' + ((mode === 'test') ? ' sidebar-active' : '')}
                onMouseDown={()=>setMode('test')}
            >
                test
                <form action={onSubmit}>
                    <label>
                        Limit steps:
                        <input className='sidebar-input' name='max-steps' type='integer' defaultValue='10'/>
                    </label>
                    <label>
                        Input tape:
                        <input className='sidebar-input' name='input-tape' type='string' defaultValue='ABA'/>
                    </label>
                    <label>
                        Save test params:
                        <input className='sidebar-btn' type='submit'/>
                    </label>
                </form>
                <button className='sidebar-btn' title='Step' onClick={onStep} disabled={testState == null}>Step</button>
                <button className='sidebar-btn' title='Fast forward' onClick={onFastForward} disabled={testState == null}>Fast forward</button>
                Status: {status}
            </div>
        </div>
    );
}

export default SideBar;