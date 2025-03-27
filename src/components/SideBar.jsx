import { useState } from 'react';

function SideBar({ 
    mode, setMode, undoStack, setUndoStack, redoStack, setRedoStack,
    states, setStates, transitions, setTransitions, testState, setTestState}) {
    const [status, setStatus] = useState('Testing information not entered');

    const onUndo = () => {
        if (mode !== 'build') return;
        const elem = undoStack.pop();
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
                setRedoStack([...redoStack, elem]);
                break;
            case 'create':
                if (elem.type === 'state' && states.find((s)=>s.id === elem.item.id) == null) {
                    setStates([...states, elem.item]);
                } else if (elem.type === 'transition') {
                    setTransitions([...transitions, elem.item]);
                }
                elem.action = 'delete';
                setRedoStack([...redoStack, elem]);  
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
                setRedoStack([...redoStack, elem])
                break;
            case 'create-multiple':
                setStates([...states, elem.state]);
                setTransitions([...transitions, ...elem.transitions]);
                elem.action = 'delete-multiple';
                setRedoStack([...redoStack, elem]);  
                break;
            default:
                break;
        };
        setUndoStack(undoStack);
    };

    const onRedo = () => {
        if (mode !== 'build') return;
        const elem = redoStack.pop();
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
                setUndoStack([...undoStack, elem]);   
                break;
            case 'create':
                if (elem.type === 'state') {
                    setStates([...states, elem.item]);
                } else if (elem.type === 'transition') {
                    setTransitions([...transitions, elem.item]);
                }
                elem.action = 'delete';
                setUndoStack([...undoStack, elem]);  
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
                setUndoStack([...undoStack, elem])
                break;
            case 'delete-multiple':
                setStates(states.filter(item => item.id !== elem.state.id));
                if (elem.transitions != null && elem.transitions.length > 0)
                setTransitions(transitions.filter(item => elem.transitions.find((t)=>t.id===item.id) != null));
                elem.action = 'create-multiple';
                setUndoStack([...undoStack, elem]);  
                break;
            default:
                break;
        };
        setRedoStack(redoStack);
    };

    const onSubmit = (data) => {
        setTestState({stateId:0, tape:data.get('input-tape'), pointer:0, step:0, maxStep:data.get('maxStep')})
        setStatus('Testing data set');
    };

    const onStep = () => {
        const c = testState.tape.charAt(testState.pointer);
        const t = transitions.find((t)=>t.from === testState.stateId && t.label.charAt(0) === c);
        if (t == null) {
            setStatus(`Rejected at state ${testState.stateId} (no valid transition)`);
            return;
        }
        setTestState({stateId:t.to, tape:testState.tape, pointer:testState.pointer+1, step:testState.step+1, maxStep:testState.maxStep});
        setStatus(`Finished step ${testState.step} at state ${testState.stateId}`);
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
                <button className='sidebar-btn' title='Step' onClick={onStep}>Step</button>
                <button className='sidebar-btn' title='Fast forward'>Fast forward</button>
                Status: {status}
            </div>
        </div>
    );
}

export default SideBar;