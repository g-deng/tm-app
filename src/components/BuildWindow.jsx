import { useState } from 'react';
import TMState from './TMState.jsx';
import TMTransition from './TMTransition.jsx';
import TMStateContext from './TMStateContext.jsx';

const strokeWidth = 3;
const rad = 20;

function BuildWindow({
  undoStack, setUndoStack, setRedoStack, states, setStates, transitions, setTransitions
}) {
  const [nextId, setNextId] = useState(3);
  const [active, setActive] = useState(null);
  // const [mouseDown, setMouseDown] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);
  const [downState, setDownState] = useState(null);
  const [overState, setOverState] = useState(null);
  const [downTransition, setDownTransition] = useState(null);
  const [transitionFrom, setTransitionFrom] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const newState = (x, y) => {
    const id = nextId;
    setNextId(nextId + 1);
    let label = null; // window.prompt('Enter label');
    if (label == null || label === '') label = `q${id}`;
    const newState = {id: id, x: x, y: y, label:label};
    setStates([...states, newState]);
    setActive(id);
    setUndoStack([...undoStack, {action:'delete', type:'state', item:newState}]);
    setRedoStack([]);
  };

  const newTransition = (s, t) => {
    if (s === t) return;
    if (transitions.includes((item) => item.from === s && item.to === t)) return;
    const id = nextId;
    setNextId(nextId + 1);
    const newTransition = {id: id, from: s, to: t, curveX: 0, curveY: (s.x < t.x) ? -30 : 30};
    while (true) {
      let input = window.prompt('Enter new label');
      if (input == null || input === '') continue;
      input = input.replace(/\s/g, "");
      const regex = new RegExp(/(?<read>(?:[^,],)*[^,])(?:\/(?<write>[^,]))?;(?<move>[LR])/);
      const matches = input.match(regex);
      if (regex.test(input) && matches.groups.read && matches.groups.move) {
        newTransition.read = matches.groups.read.split(",");
        newTransition.write = matches.groups.write;
        newTransition.move = matches.groups.move;
        break;
      }
      window.alert("Doesn't match format: A/B;R or A,B,C/D;L or A;R");
    }
    
    setTransitions([...transitions, newTransition]);
    setActive(id);
    setUndoStack([...undoStack, {action:'delete', type:'transition', item:newTransition}]);
    setRedoStack([]);
  }

  const deleteItem = (id) => {
    if (active == null) return;
    if (id === 0) {
      window.alert('Not allowed to delete initial state!');
      return;
    }
    const s = states.find((s) => s.id === id);
    const t = transitions.find((t) => t.id === id);
    if (s != null) {
      const removedTransitions = transitions.filter((item) => item.from === id || item.to === id);
      setTransitions(transitions.filter((item) => item.from !== id && item.to !== id));
      setStates(states.filter((item) => item.id !== id));  
      setUndoStack([...undoStack, 
        {action:'create-multiple', state: s, transitions: removedTransitions}]);
    } else if (t != null) {
      setTransitions(transitions.filter((item) => item.id !== id));
      setUndoStack([...undoStack, {action:'create', type:'transition', item:t}]);
    }
    setRedoStack([]);
    setActive(null);
  }

  const getStateByPosition = (x, y) => {
    return states.find((s) => Math.sqrt(Math.pow(s.x-x, 2) + Math.pow(s.y-y, 2)) < rad);
  }

  const getCurveByPosition = (x, y) => {
    return transitions.find((t) => {
      const fromState = states.find((s) => s.id === t.from);
      const toState = states.find((s) => s.id === t.to);
      if (fromState == null || toState == null) return false;
      const distX = (toState.x - fromState.x);
      const distY = (toState.y - fromState.y);
      return Math.hypot((fromState.x + distX/2 + t.curveX) - x, (fromState.y + distY/2 + t.curveY) - (y)) < rad/4;
    });
  }

  const onMouseMove = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    // console.log(`mouse move to ${x}, ${y}`);
    setMousePosition({ x, y });
    if (downState != null) {
      downState.x = x;
      downState.y = y;
      setTrigger(!trigger);
    }
    if (downTransition != null) {
      const fromState = states.find((s) => s.id === downTransition.from);
      const toState = states.find((s) => s.id === downTransition.to);
      const distX = (toState.x - fromState.x);
      const distY = (toState.y - fromState.y);
      downTransition.curveX = x - (fromState.x + distX/2);
      downTransition.curveY = y - (fromState.y + distY/2);
      console.log("dragged");
      console.log(downTransition);
    }
    
    setOverState(getStateByPosition(x,y));
  };

  const onMouseDown = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    // console.log(`mouse down at ${x}, ${y}`);
    // setMouseDown({ x, y });
    setDownState(getStateByPosition(x, y));
    setDownTransition(getCurveByPosition(x, y));
    console.log(downTransition);
    console.log("tried");
    setOverState(downState);
  };

  const onMouseUp = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    const s = getStateByPosition(x,y);
    if (downState != null) {
      downState.x = x;
      downState.y = y;
    }
    // setMouseDown(null);
    setDownState(null);
    if (transitionFrom != null && s != null) {
        newTransition(transitionFrom.id, s.id);
    }
    setTransitionFrom(null);
    setDownTransition(null);
  };

  const onBuilderDoubleClick = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    if (getStateByPosition(x, y) == null)
      newState(x,y);
    // setMouseDown(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteItem(active);
    }
  }

  const drawTransitions = transitions.map((t) => 
    <TMTransition t={t} states={states} active={active} setActive={setActive} trigger={trigger} setTrigger={setTrigger} clickable='true'/>
  );

  const drawStates = states.map((s) => 
    <TMState s={s} active={active} setActive={setActive} trigger={trigger} setTrigger={setTrigger} clickable='true'/>
  );

  const drawPreviewTransition = () => {
    if (transitionFrom == null) return <></>;
    if (overState == null) {
      const distX = (mousePosition.x - transitionFrom.x);
      const distY = (mousePosition.y - transitionFrom.y);
      const dist = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2));
      return (
        <line key={'tprev'} x1={transitionFrom.x + distX*(rad+3*strokeWidth)/dist} x2={mousePosition.x} 
          y1={transitionFrom.y + distY*(rad+3*strokeWidth)/dist} y2={mousePosition.y} stroke="black" strokeWidth={strokeWidth} markerEnd="url(#arrow)"/>
      );
    } else if (overState.id !== transitionFrom.id) {
      const distX = (overState.x - transitionFrom.x);
      const distY = (overState.y - transitionFrom.y);
      const dist = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2));
      return (
        <line key={'tprev'} x1={transitionFrom.x + distX*(rad+strokeWidth)/dist} x2={overState.x-distX*(rad+3*strokeWidth)/dist} 
          y1={transitionFrom.y + distY*(rad+strokeWidth)/dist} y2={overState.y-distY*(rad+3*strokeWidth)/dist} stroke="black" strokeWidth={strokeWidth} markerEnd="url(#arrow)"/>
      );
    }
    return <></>;
    
  };

  return (
    <div className='window-div'>
      <svg key='windowFrame' className='window' xmlns="http://www.w3.org/2000/svg"
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDoubleClick={(e) => onBuilderDoubleClick(e)}
      tabIndex='1'
      onKeyDown={(e) => onKeyDown(e)}>
        <rect x='0' y='0' width='100%' height='100%' stroke='black' strokeWidth='1' fillOpacity='0'/>
        {drawTransitions}
        {drawStates}
        {(active !== null) && <TMStateContext id={active} states={states} deleteState={deleteItem} setTransitionFrom={setTransitionFrom}/>}
        {drawPreviewTransition()}
      </svg>
    </div>
  );
}

  export default BuildWindow;