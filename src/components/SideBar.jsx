
function SideBar({ mode, setMode, undoStack, setUndoStack, redoStack, setRedoStack, states, setStates, transitions, setTransitions }) {

    const onUndo = () => {
        if (mode !== 'build') return;
        const elem = undoStack.pop();
        console.log(elem);
        console.log(undoStack);
        console.log(redoStack);
        if (elem == null || elem.action == null) return;
        switch (elem.action) {
            case 'delete':
                if (elem.type === 'state') {
                    setStates(states.filter(item => item.id !== elem.item.id));
                } else if (elem.type === 'transition') {
                    setStates(transitions.filter(item => item.id !== elem.item.id));
                }
                elem.action = 'create';
                setRedoStack([...redoStack, elem]);   
                break;
            case 'create':
                if (elem.type === 'state') {
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
        console.log(undoStack);
        console.log(redoStack);
        if (elem == null || elem.action == null) return;
        switch (elem.action) {
            case 'delete':
                if (elem.type === 'state') {
                    setStates(states.filter(item => item.id !== elem.item.id));
                } else if (elem.type === 'transition') {
                    setStates(transitions.filter(item => item.id !== elem.item.id));
                }
                elem.type = 'create';
                setUndoStack([...undoStack, elem]);   
                break;
            case 'create':
                if (elem.type === 'state') {
                    setStates([...states, elem.item]);
                } else if (elem.type === 'transition') {
                    setTransitions([...transitions, elem.item]);
                }
                elem.type = 'delete';
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
                setTransitions(transitions.filter(item => elem.transitions.find((t)=>t.id===item.id) != null));
                elem.action = 'create-multiple';
                setUndoStack([...undoStack, elem]);  
                break;
            default:
                break;
        };
        setRedoStack(redoStack);
    };

    return (
        <div className='sidebar'>
            <div 
                className='sidebar-section'
                onMouseDown={()=>setMode('build')}
            >
                build
               <button className='sidebar-btn' title='Undo' onClick={onUndo}>Undo</button>
               <button className='sidebar-btn' title='Redo' onClick={onRedo}>Redo</button>
            </div>
            
            <div 
                className='sidebar-section'
                onMouseDown={()=>setMode('test')}
            >
                test
                <form>
                    <label>
                        Limit steps:
                        <input className='sidebar-input' type='integer' defaultValue='10'/>
                    </label>
                </form>
                <button className='sidebar-btn' title='Step'>Step</button>
                <button className='sidebar-btn' title='Fast forward'>Fast forward</button>
            </div>
        </div>
    );
}

export default SideBar;