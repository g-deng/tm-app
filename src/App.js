import './App.css';
import BuildWindow from './components/BuildWindow.jsx';
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
        <BuildWindow key='window' states={states} setStates={setStates} transitions={transitions} setTransitions={setTransitions}/>
      </div>
    </div>
  );
}
export default App;
