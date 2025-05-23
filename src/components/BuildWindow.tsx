import { useState, useRef, useEffect } from 'react';
import TMState from './TMState.js';
import TMTransition from './TMTransition.js';
import TMStateContext from './TMStateContext.js';
import TMStatePopup from './TMStatePopup.js';
import { StateData, TransitionData } from '../types/elems.js';
import { AppProps } from '../App.types.js';
import { getById, euclid, closestOutOfRadius } from '../utils.js';
import { Point } from '../types/user.js';
import TMTransitionPopup from './TMTransitionPopup.js';
import TMTransitionContext from './TMTransitionContext.js';

const strokeWidth = 3;
const rad = 20;

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
    const [contextState, setContextState] = useState<{state: StateData, x: number, y: number} | null>(null);
    const [contextTransition, setContextTransition] = useState<{transition: TransitionData, x: number, y: number} | null>(null);
    const [mousePosition, setMousePosition] = useState<Point | null>(null);
    const [downState, setDownState] = useState<StateData | null>(null);
    const [overState, setOverState] = useState<StateData | null>(null);
    const [transitionFrom, setTransitionFrom] = useState<StateData | null>(null);
    const [downTransition, setDownTransition] = useState<TransitionData | null>(null);
    const [trigger, setTrigger] = useState(false);

    const [translate, setTranslate] = useState<Point>({x:0, y:0});
    const [panStart, setPanStart] = useState<Point | null>(null);
    const [zoom, setZoom] = useState(1);

    const takeId = () => {
        const id = nextId;
        setNextId(nextId + 1);
        return id;
    };

    /* EDITING ELEMENTS */

    /** Creates a new state with a unique id.
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

    /** Creates a new transition with a unique id.
     * @param s id of source state
     * @param t id of target state
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
            if (contextState?.state.id === id) setContextState(null);
        } else if (t != null) {
            setTransitions(transitions.filter((item) => item.id !== id));
            setUndoStack([
                ...undoStack,
                { action: 'create', type: 'transition', item: t },
            ]);
            console.log(transitions);
            if (contextTransition?.transition.id === id) setContextTransition(null);
        }
        setRedoStack([]);
        setActiveId(null);
        setTrigger(!trigger);
    };

    /* POSITION CALCULATORS */

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


    /* USER INTERACTION EVENT HANDLERS */

    const onMouseMove = (e : React.MouseEvent) => {
        const { offsetX, offsetY } = e.nativeEvent;

        const x = (offsetX - translate.x) / zoom;
        const y = (offsetY - translate.y) / zoom;

        setMousePosition({ x, y });

        // Drag state
        if (downState != null) {
            downState.x = x;
            downState.y = y;
            setTrigger(!trigger);
        }

        // Drag transition handle
        if (downTransition != null) {
            const fromState = getById(states, downTransition.from);
            const toState = getById(states, downTransition.to);

            if (!fromState || !toState) return;

            const midX = fromState.x + (toState.x - fromState.x) / 2;
            const midY = fromState.y + (toState.y - fromState.y) / 2;
            let pos = closestOutOfRadius({x, y}, {x:fromState.x, y:fromState.y}, rad*3);
            if (pos.x === x && pos.y === y) pos = closestOutOfRadius({x, y}, {x:toState.x, y:toState.y}, rad*3);
            downTransition.curveX = pos.x - midX;
            downTransition.curveY = pos.y - midY;
            console.log('dragged');
            console.log(downTransition);
        }

        setOverState(getStateByPosition(x, y));

        if (panStart != null) {
            const dx = offsetX - panStart.x;
            const dy = offsetY - panStart.y;
            setTranslate({x: translate.x + dx, y: translate.y + dy});
            setPanStart({x: offsetX, y: offsetY});
        }
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const x = (offsetX - translate.x) / zoom;
        const y = (offsetY - translate.y) / zoom;

        setDownState(getStateByPosition(x, y));
        setDownTransition(getCurveByPosition(x, y));
        setOverState(downState);
        setContextState(null);
        setContextTransition(null);

        console.log('mousedown', downState, downTransition);

        if (e.shiftKey) {
            setPanStart({ x: offsetX, y: offsetY });
        }
    };

    const onMouseUp = (e: React.MouseEvent) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const x = (offsetX - translate.x) / zoom;
        const y = (offsetY - translate.y) / zoom;

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

        if (panStart != null) {
            setPanStart(null);
        }
    };

    const onBuilderDoubleClick = (e : React.MouseEvent) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const x = (offsetX - translate.x) / zoom;
        const y = (offsetY - translate.y) / zoom;

        if (getStateByPosition(x, y) == null) newState(x, y);
    };

    const onKeyDown = (e : React.KeyboardEvent) => {
        // if (e.key === 'Delete' || e.key === 'Backspace') {
        //     deleteItem(activeId);
        // }
    };

    // const onWheel = (e: React.WheelEvent) => {
    //     const delta = e.deltaY > 0 ? -0.1 : 0.1;
    //     const newZoom = Math.max(0.1, Math.min(2, zoom + delta));
    //     setZoom(newZoom);
    // }

    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const svgRect = svg.getBoundingClientRect();

            const cursorX = e.clientX - svgRect.left;
            const cursorY = e.clientY - svgRect.top;

            // Convert cursor from screen -> SVG coords
            const svgX = (cursorX - translate.x) / zoom;
            const svgY = (cursorY - translate.y) / zoom;

            // Zoom factor
            const zoomIntensity = 0.001;
            const rawFactor = 1 - e.deltaY * zoomIntensity;
            const scaleFactor = Math.min(Math.max(rawFactor, 0.8), 1.2);

            setZoom(zoom => {
                const newScale = Math.max(0.01, Math.min(10, zoom * scaleFactor));

                // Compute new translation to keep point under cursor fixed
                const newTranslateX = cursorX - svgX * newScale;
                const newTranslateY = cursorY - svgY * newScale;

                setTranslate({ x: newTranslateX, y: newTranslateY });
                return newScale;
            });
        };

        svg.addEventListener('wheel', handleWheel, { passive: false });
        return () => svg.removeEventListener('wheel', handleWheel);
    }, [zoom, translate]);



    const drawTransitions = transitions.map((t) => (
        <TMTransition
            key={t.id}
            t={t}
            states={states}
            activeId={activeId}
            setActiveId={setActiveId}
            trigger={trigger}
            setTrigger={setTrigger}
            clickable={true}
            setContextTransition={setContextTransition}
        />
    ));

    const drawStates = states.map((s) => (
        <TMState
            key={s.id}
            s={s}
            activeId={activeId}
            setActiveId={setActiveId}
            trigger={trigger}
            setTrigger={setTrigger}
            clickable={true}
            setContextState={setContextState}
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
                ref={svgRef}
                key="windowFrame"
                className="window"
                xmlns="http://www.w3.org/2000/svg"
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onDoubleClick={(e) => onBuilderDoubleClick(e)}
                tabIndex={1}
                onKeyDown={(e) => onKeyDown(e)}
                preserveAspectRatio="none"
            >
                <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#aaaaaa" strokeWidth="1" />
                    </pattern>
                </defs>

                {<g key="content" transform={`translate(${translate.x}, ${translate.y}) scale(${zoom})`}>
                    <rect x="-50000" y="-50000" width="100000" height="100000" fill="url(#grid)" />
                    {drawTransitions}
                    {drawStates}
                    {contextState !== null && (
                        <TMStateContext
                            contextState={contextState}
                            deleteState={deleteItem}
                            setTransitionFrom={setTransitionFrom}
                            setActiveId={setActiveId}
                        />
                    )}
                    {contextTransition !== null && (
                        <TMTransitionContext
                            contextTransition={contextTransition}
                            deleteTransition={deleteItem}
                            setActiveId={setActiveId}
                        />
                    )}
                    {activeId !== null && (
                        <TMStatePopup
                            initialLabel={getById(states, activeId)?.label || ""}
                            activeId={activeId}
                            setActiveId={setActiveId}
                            states={states}
                            transitions={transitions}
                            onLabelUpdate={(s) => {
                                const state = getById(states, activeId);
                                if (state) {
                                    state.label = s;
                                    setStates(states);
                                    setTrigger(!trigger);
                                }
                            }}
                            onAddTransition={setTransitionFrom}
                            onDeleteTransition={deleteItem}
                            onDeleteState={()=>deleteItem(activeId)}
                            onTransitionClick={(id) => {
                                setActiveId(id);
                                setTrigger(!trigger);
                            }}
                            containerWidth={400}
                        />
                    )}
                    {activeId !== null && (
                        <TMTransitionPopup
                            activeId={activeId}
                            setActiveId={setActiveId}
                            states={states}
                            transition={getById(transitions, activeId)}
                            onUpdateTransition={(t) => {
                                const removed = transitions.filter((item) => item.id !== activeId);
                                setTransitions([...removed, t]);
                            }}
                            onDeleteTransition={deleteItem}
                            containerWidth={400}
                        />
                    )}
                    {drawPreviewTransition()}

                </g>}
            </svg>
        </div>
    );
}

export default BuildWindow;
