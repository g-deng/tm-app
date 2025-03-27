import './App.css';
import BuildWindow from './components/BuildWindow.jsx';
import TestWindow from './components/TestWindow.jsx';
import SideBar from './components/SideBar.jsx';
import { useState } from 'react';

function App() {
  const [states, setStates] = useState([
    { id: 0, x: 100, y: 100, label: "q0"},
    { id: 1, x: 200, y: 200, label: "q1"}
  ]);
  const [transitions, setTransitions] = useState([
    { id: 2, from: 0, to: 1, label: "A/B; R"}
  ]);
  const [mode, setMode] = useState('build');
  const [undoStack, setUndoStack] = useState([]); // {action, type, item}
  const [redoStack, setRedoStack] = useState([]);
  const [testState, setTestState] = useState(null); // {stateId, tape, pointer, step, maxStep}

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Turing Machine??? :o :D :p
        </p>
      </header>
      <div className="Window">
        {(mode === "build") && <BuildWindow key='window' states={states} setStates={setStates} transitions={transitions} setTransitions={setTransitions}
        undoStack={undoStack} setUndoStack={setUndoStack} redoStack={redoStack} setRedoStack={setRedoStack} testState={testState}/>}
        {(mode === "test") && <TestWindow states={states} transitions={transitions} testState={testState}/>}
      </div>
      <SideBar key='sidebar' states={states} setStates={setStates} transitions={transitions} setTransitions={setTransitions}
        mode={mode} setMode={setMode} undoStack={undoStack} setUndoStack={setUndoStack} redoStack={redoStack} setRedoStack={setRedoStack}
        testState={testState} setTestState={setTestState}/>
    </div>
  );
}
export default App;
