import './App.css';
import { useState } from 'react';

function App() {
  const [states, setStates] = useState([
    { id: 0, x: 100, y: 100, label: "q0"},
    { id: 1, x: 200, y: 200, label: "q1"}
  ]);
  const [transitions, setTransitions] = useState([
    { id: 2, from: 0, to: 1, label: "A/B; R"}
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          HIIIII
        </p>
      </header>
      <div className="Window">
        <Builder states={states} setStates={setStates} transitions={transitions} setTransitions={setTransitions}/>
      </div>
    </div>
  );
}
export default App;

function Builder({states, setStates, transitions, setTransitions}) {

  const [activeState, setActiveState] = useState(null);
  const [activeTransition, setActiveTransition] = useState(null);

  const onStateClick = (id) => {
    setActiveState(id);
    setActiveTransition(null);
    window.alert('clicked state ' + id);
  };

  const onTransitionClick = (id) => {
    setActiveTransition(id);
    setActiveState(null);
    window.alert('clicked transition ' + id);
  }

  const rad = 20;
  const stroke = 3;

  const drawStates = states.map((s) => {
    return (
    <circle key={s.id} cx={s.x} cy={s.y} r={rad} stroke-width={stroke}
    onClick={() => onStateClick(s.id)} />);
  });
  
  const drawTransitions = transitions.map((t) => {
    const fromState = states.find((s) => s.id === t.from);
    const toState = states.find((s) => s.id === t.to);
    const distX = (toState.x - fromState.x);
    const distY = (toState.y - fromState.y);
    const dist = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2));
    return (
      <line key={t.id} x1={fromState.x} x2={toState.x-distX*(rad+2*stroke)/dist} 
      y1={fromState.y} y2={toState.y-distY*(rad+2*stroke)/dist} 
      stroke="black" stroke-width={stroke} marker-end="url(#arrow)"
      onClick={() => onTransitionClick(t.id)}/>
    );
  });

  return (
    <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
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
    </svg>
  );
}
