import { useState } from 'react';
import TMState from './TMState.jsx';
import TMTransition from './TMTransition.jsx';
import TMContext from './TMContext.jsx';

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
    const label = window.prompt('Enter label');
    const newState = {id: id, x: x, y: y, label:`q${label}`};
    setStates([...states, newState]);
    setActive(id);
  };

  const deleteState = (id) => {
    setTransitions(transitions.filter((item) => item.from !== id && item.to !== id));
    setStates(states.filter((item) => item.id !== id));
    setActive(null);
  }

  const newTransition = (s, t) => {
    if (s === t) return;
    if (transitions.includes((item) => item.from === s && item.to === t)) return;
    const id = nextId;
    setNextId(nextId + 1);
    const label = window.prompt('Enter label');
    const newTransition = {id: id, from: s, to: t, label: label};
    setTransitions([...transitions, newTransition]);
    setActive(id);
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
    if (downState != null) {
      downState.x = x;
      downState.y = y;
    }
    // setMouseDown(null);
    setDownState(null);
    if (transitionFrom != null) {
      const s = getStateByPosition(x,y);
      if (s != null)
        newTransition(transitionFrom.id, s.id);
    }
    setTransitionFrom(null);
  };

  const onBuilderDoubleClick = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    newState(x,y);
    // setMouseDown(null);
  };

  const drawTransitions = transitions.map((t) => 
    <TMTransition t={t} states={states} active={active} setActive={setActive}/>
  );

  const drawStates = states.map((s) => 
    <TMState s={s} active={active} setActive={setActive}/>
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
    onDoubleClick={(e) => onBuilderDoubleClick(e)}>
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
      {drawTransitions}
      {drawStates}
      {(active !== null) && <TMContext id={active} states={states} deleteState={deleteState} setTransitionFrom={setTransitionFrom}/>}
      {drawPreviewTransition()}
    </svg>
  );
}

  export default BuildWindow;