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
    <div className="window-div">
      <svg key='windowFrame' className="window" xmlns="http://www.w3.org/2000/svg"
          onClick={onClick}
      >
        <rect x='0' y='0' width='100%' height='100%' stroke='black' strokeWidth='1' fillOpacity='0'/>
        {drawTransitions}
        {drawStates}
      </svg>
    </div>
  );
}

  export default TestWindow;