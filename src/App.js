import './App.css';
import BuildWindow from './components/BuildWindow.jsx';
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

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Turing Machine??? :o :D :p
        </p>
      </header>
      <div className="Window">
        <BuildWindow key='window' states={states} setStates={setStates} transitions={transitions} setTransitions={setTransitions}
        undoStack={undoStack} setUndoStack={setUndoStack} redoStack={redoStack} setRedoStack={setRedoStack}/>
        <SideBar key='sidebar' states={states} setStates={setStates} transitions={transitions} setTransitions={setTransitions}
        mode={mode} setMode={setMode} undoStack={undoStack} setUndoStack={setUndoStack} redoStack={redoStack} setRedoStack={setRedoStack}/>
      </div>
    </div>
  );
}
export default App;
