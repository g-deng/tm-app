import { useState } from 'react';
import TMState from './TMState.jsx';
import TMTransition from './TMTransition.jsx';

function TestWindow({
  states, transitions, testState, 
}) {
  const [trigger, setTrigger] = useState(false);
  const active = (testState) ? testState.stateId : null;

  const drawTransitions = transitions.map((t) => 
    <TMTransition t={t} states={states} active={active} trigger={trigger} setTrigger={setTrigger}/>
  );

  const drawStates = states.map((s) => 
    <TMState s={s} active={active} trigger={trigger} setTrigger={setTrigger}/>
  );

  const onClick = () => {
    window.alert("Switch to Build mode to edit!");
  }

  return (
    <div className='window-container'>
      <svg key='windowFrame' className='window' xmlns="http://www.w3.org/2000/svg"
          onClick={onClick}
      >
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
      </svg>
    </div>
  );
}

  export default TestWindow;