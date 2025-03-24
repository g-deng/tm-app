import { useState } from 'react';
import TMState from './TMState.jsx';
import TMTransition from './TMTransition.jsx';
import TMStateContext from './TMStateContext.jsx';

const strokeWidth = 3;
const rad = 20;

function BuildWindow({states, setStates, transitions, setTransitions}) {
  const [nextId, setNextId] = useState(3);
  const [active, setActive] = useState(null);
  // const [mouseDown, setMouseDown] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);
  const [downState, setDownState] = useState(null);
  const [overState, setOverState] = useState(null);
  const [transitionFrom, setTransitionFrom] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const newState = (x, y) => {
    const id = nextId;
    setNextId(nextId + 1);
    let label = window.prompt('Enter label');
    if (label == null || label === '') label = `q${id}`;
    const newState = {id: id, x: x, y: y, label:label};
    setStates([...states, newState]);
    setActive(id);
  };

  const newTransition = (s, t) => {
    if (s === t) return;
    if (transitions.includes((item) => item.from === s && item.to === t)) return;
    const id = nextId;
    setNextId(nextId + 1);
    let label = window.prompt('Enter label');
    if (label == null || label === '') label = 'ctrl + click to change';
    const newTransition = {id: id, from: s, to: t, label: label};
    setTransitions([...transitions, newTransition]);
    setActive(id);
  }

  const deleteItem = (id) => {
    if (active == null) return;
    const s = states.find((s) => s.id === id);
    const t = transitions.find((t) => t.id === id);
    if (s != null) {
      setTransitions(transitions.filter((item) => item.from !== id && item.to !== id));
      setStates(states.filter((item) => item.id !== id));
    } else if (t != null) {
      setTransitions(transitions.filter((item) => item.id !== id));
    }
    setActive(null);
  }

  const getStateByPosition = (x, y) => {
    return states.find((s) => Math.sqrt(Math.pow(s.x-x, 2) + Math.pow(s.y-y, 2)) < rad);
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
    setOverState(getStateByPosition(x,y));
  };

  const onMouseDown = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    // console.log(`mouse down at ${x}, ${y}`);
    // setMouseDown({ x, y });
    setDownState(getStateByPosition(x, y));
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
  };

  const onBuilderDoubleClick = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    newState(x,y);
    // setMouseDown(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteItem(active);
    }
  }

  const drawTransitions = transitions.map((t) => 
    <TMTransition t={t} states={states} active={active} setActive={setActive} trigger={trigger} setTrigger={setTrigger}/>
  );

  const drawStates = states.map((s) => 
    <TMState s={s} active={active} setActive={setActive} trigger={trigger} setTrigger={setTrigger}/>
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
    <svg key='windowFrame' width="500" height="500" xmlns="http://www.w3.org/2000/svg"
    onMouseMove={onMouseMove}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onDoubleClick={(e) => onBuilderDoubleClick(e)}
    tabIndex='1'
    onKeyDown={(e) => onKeyDown(e)}>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
      <rect x='0' y='0' width='100%' height='100%' stroke='black' strokeWidth='1' fillOpacity='0'/>
      {drawTransitions}
      {drawStates}
      {(active !== null) && <TMStateContext id={active} states={states} deleteState={deleteItem} setTransitionFrom={setTransitionFrom}/>}
      {drawPreviewTransition()}
    </svg>
  );
}

  export default BuildWindow;