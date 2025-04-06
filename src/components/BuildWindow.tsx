import { useState } from 'react';
import TMState from './TMState.js';
import TMTransition from './TMTransition.js';
import TMStateContext from './TMStateContext.js';
import { StateData, TransitionData } from '../types/elems.js';
import { AppProps } from '../App.types.js';
import { getById, euclid } from '../utils.js';

const strokeWidth = 3;
const rad = 20;

type Position = { x: number; y: number };

function BuildWindow({
    states,
    setStates,
    transitions,
    setTransitions,
    undoStack,
    setUndoStack,
    setRedoStack,
    ...rest
}: AppProps) {
    const [nextId, setNextId] = useState<number>(3);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState<Position | null>(null);
    const [downState, setDownState] = useState<StateData | null>(null);
    const [overState, setOverState] = useState<StateData | null>(null);
    const [transitionFrom, setTransitionFrom] = useState<StateData | null>(
        null,
    );
    const [downTransition, setDownTransition] = useState<TransitionData | null>(
        null,
    );
    const [trigger, setTrigger] = useState(false);

    const takeId = () => {
        const id = nextId;
        setNextId(nextId + 1);
        return id;
    };

    /* EDITING ELEMENTS */

    /**
     * Creates a new state with a unique id.
     * @param x x-val of location in BuildWindow
     * @param y y-val of location in BuildWindow
     */
    const newState = (x: number, y: number) => {
        const id = takeId();

        let label = null; // window.prompt('Enter label');
        if (label == null || label === '') label = `q${id}`;
        const newState = { id: id, x: x, y: y, label: label };
        setStates([...states, newState]);
        setActiveId(id);
        setUndoStack([
            ...undoStack,
            { action: 'delete', type: 'state', item: newState },
        ]);
        setRedoStack([]);
    };

    /**
     * Creates a new transition with a unique id.
     * @param s 
     * @param t 
     */
    const newTransition = (s: number, t: number) => {
        // Check if transition already exists
        if (transitions.filter((item) => (item.from === s) && (item.to === t)).length > 0) {
            return;
        }

        const id = takeId();

        const newTransition : TransitionData = {
            id: id,
            from: s,
            to: t,
            read: [],
            write: null, 
            move: 'R',
            curveX: 0,
            curveY: s < t ? -30 : 30,
        };

        while (true) {
            let input = window.prompt('Enter new label');
            if (input == null || input === '') continue;
            
            // check if format matches
            input = input.replace(/\s/g, '');
            const regex = new RegExp(
                /(?<read>(?:[^,],)*[^,])(?:\/(?<write>[^,]))?;(?<move>[LR])/,
            );
            const matches = input.match(regex);
            if (
                matches && matches.groups &&
                regex.test(input) &&
                matches.groups.read &&
                matches.groups.move
            ) {
                newTransition.read = matches.groups.read.split(',');
                newTransition.write = matches.groups.write;
                newTransition.move = matches.groups.move;
                break;
            }
            window.alert("Doesn't match format: A/B;R or A,B,C/D;L or A;R");
        }

        setTransitions([...transitions, newTransition]);
        setActiveId(id);
        setUndoStack([
            ...undoStack,
            { action: 'delete', type: 'transition', item: newTransition },
        ]);
        setRedoStack([]);
    };

    const deleteItem = (id : number | null) => {
        if (id == null) return;

        const s = getById(states, id);
        const t = getById(transitions, id);

        if (s != null) {
            const removedTransitions = transitions.filter(
                (item) => item.from === id || item.to === id,
            );
            setTransitions(
                transitions.filter(
                    (item) => item.from !== id && item.to !== id,
                ),
            );
            setStates(states.filter((item) => item.id !== id));
            setUndoStack([
                ...undoStack,
                {
                    action: 'create-multiple',
                    state: s,
                    transitions: removedTransitions,
                },
            ]);
        } else if (t != null) {
            setTransitions(transitions.filter((item) => item.id !== id));
            setUndoStack([
                ...undoStack,
                { action: 'create', type: 'transition', item: t },
            ]);
        }
        setRedoStack([]);
        setActiveId(null);
    };

    const getStateByPosition = (x: number, y: number) => {
        const out = states.find((s) => euclid(s.x, s.y, x, y) < rad);

        if (out) return out;
        else return null;
    };

    const getCurveByPosition = (x: number, y: number) => {
        const out =  transitions.find((t) => {
            const fromState = getById(states, t.from);
            const toState = getById(states, t.to);
            if (fromState == null || toState == null) return false;

            const distX = toState.x - fromState.x;
            const distY = toState.y - fromState.y;
            return (
                euclid(x, y, fromState.x + distX / 2 + t.curveX, fromState.y + distY / 2 + t.curveY) < rad / 4
            );
        });

        if (out) return out;
        else return null;
    };

    const onMouseMove = (e : React.MouseEvent) => {
        const { offsetX: x, offsetY: y } = e.nativeEvent;
        setMousePosition({ x, y });
        if (downState != null) {
            downState.x = x;
            downState.y = y;
            setTrigger(!trigger);
        }
        if (downTransition != null) {
            const fromState = getById(states, downTransition.from);
            const toState = getById(states, downTransition.to);

            if (!fromState || !toState) return;

            const distX = toState.x - fromState.x;
            const distY = toState.y - fromState.y;
            downTransition.curveX = x - (fromState.x + distX / 2);
            downTransition.curveY = y - (fromState.y + distY / 2);
            console.log('dragged');
            console.log(downTransition);
        }

        setOverState(getStateByPosition(x, y));
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const { offsetX: x, offsetY: y } = e.nativeEvent;
        setDownState(getStateByPosition(x, y));
        setDownTransition(getCurveByPosition(x, y));
        setOverState(downState);
    };

    const onMouseUp = (e: React.MouseEvent) => {
        const { offsetX: x, offsetY: y } = e.nativeEvent;
        const s = getStateByPosition(x, y);
        if (downState != null) {
            downState.x = x;
            downState.y = y;
        }
        setDownState(null);

        if (transitionFrom != null && s != null) {
            newTransition(transitionFrom.id, s.id);
        }
        setTransitionFrom(null);
        setDownTransition(null);
    };

    const onBuilderDoubleClick = (e : React.MouseEvent) => {
        const { offsetX: x, offsetY: y } = e.nativeEvent;
        if (getStateByPosition(x, y) == null) newState(x, y);
    };

    const onKeyDown = (e : React.KeyboardEvent) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            deleteItem(activeId);
        }
    };

    const drawTransitions = transitions.map((t) => (
        <TMTransition
            t={t}
            states={states}
            activeId={activeId}
            setActiveId={setActiveId}
            trigger={trigger}
            setTrigger={setTrigger}
            clickable="true"
        />
    ));

    const drawStates = states.map((s) => (
        <TMState
            s={s}
            activeId={activeId}
            setActiveId={setActiveId}
            trigger={trigger}
            setTrigger={setTrigger}
            clickable={true}
        />
    ));

    const drawPreviewTransition = () => {
        if (transitionFrom == null || mousePosition == null) return <></>;
        if (overState == null) {
            const distX = mousePosition.x - transitionFrom.x;
            const distY = mousePosition.y - transitionFrom.y;
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            return (
                <line
                    key={'tprev'}
                    x1={
                        transitionFrom.x +
                        (distX * (rad + 3 * strokeWidth)) / dist
                    }
                    x2={mousePosition.x}
                    y1={
                        transitionFrom.y +
                        (distY * (rad + 3 * strokeWidth)) / dist
                    }
                    y2={mousePosition.y}
                    stroke="black"
                    strokeWidth={strokeWidth}
                    markerEnd="url(#arrow)"
                />
            );
        } else if (overState.id !== transitionFrom.id) {
            const distX = overState.x - transitionFrom.x;
            const distY = overState.y - transitionFrom.y;
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            return (
                <line
                    key={'tprev'}
                    x1={transitionFrom.x + (distX * (rad + strokeWidth)) / dist}
                    x2={overState.x - (distX * (rad + 3 * strokeWidth)) / dist}
                    y1={transitionFrom.y + (distY * (rad + strokeWidth)) / dist}
                    y2={overState.y - (distY * (rad + 3 * strokeWidth)) / dist}
                    stroke="black"
                    strokeWidth={strokeWidth}
                    markerEnd="url(#arrow)"
                />
            );
        }
        return <></>;
    };

    return (
        <div className="window-div">
            <svg
                key="windowFrame"
                className="window"
                xmlns="http://www.w3.org/2000/svg"
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onDoubleClick={(e) => onBuilderDoubleClick(e)}
                tabIndex={1}
                onKeyDown={(e) => onKeyDown(e)}
            >
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    stroke="black"
                    strokeWidth="1"
                    fillOpacity="0"
                />
                {drawTransitions}
                {drawStates}
                {activeId !== null && (
                    <TMStateContext
                        id={activeId}
                        states={states}
                        deleteState={deleteItem}
                        setTransitionFrom={setTransitionFrom}
                    />
                )}
                {drawPreviewTransition()}
            </svg>
        </div>
    );
}

export default BuildWindow;
