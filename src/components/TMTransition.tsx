import { StateData, TransitionData } from "../types/elems";

interface TMTransitionProps {
    t: TransitionData;
    states: StateData[];
    activeId: number | null;
    setActiveId: React.Dispatch<React.SetStateAction<number|null>>;
    trigger: boolean;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
    clickable: boolean;
    setContextTransition: (t: {transition: TransitionData, x: number, y: number}) => void;
}

function TMTransition(
    {
        t, states, activeId, setActiveId, trigger, setTrigger, clickable, setContextTransition
    } : TMTransitionProps
) {
    const rad = 20;
    const strokeWidth = 3;

    const onTransitionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!clickable) return;

        if (e.ctrlKey) {
            let input = window.prompt('Enter new label');
            if (input == null || input === '') return;
            
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
                t.read = matches.groups.read.split(',');
                t.write = matches.groups.write;
                t.move = matches.groups.move;
            }
            console.log(t);
        } 

        setTrigger(!trigger);
        setActiveId(t.id);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!clickable) return;
        const { offsetX: x, offsetY: y } = e.nativeEvent;
        setContextTransition({transition: t, x, y});
        setTrigger(!trigger);
        console.log('Context menu from transition', t, x, y);
    }

    const fromState = states.find((s) => s.id === t.from);
    const toState = states.find((s) => s.id === t.to);
    if (fromState == null || toState == null) return <></>;
    const distX = toState.x - fromState.x;
    const distY = toState.y - fromState.y;

    const curvePos = {
        x: fromState.x + distX / 2 + t.curveX,
        y: fromState.y + distY / 2 + t.curveY,
    };

    return (
        <g
            onClick={onTransitionClick}
            onContextMenu={handleContextMenu}
            style={{ cursor: 'pointer' }}
        >
            <marker
                id="arrow"
                viewBox="0 0 16 16"
                refX={rad + 12}
                refY="8"
                markerWidth="6"
                markerHeight="6"
                markerUnits="strokeWidth"
                orient="auto-start-reverse"
            >
                <path d="M 0 0 L 16 8 L 0 16 z" />
            </marker>

            <path
                d={`M ${fromState.x} ${fromState.y} Q ${curvePos.x + t.curveX} ${curvePos.y + t.curveY} ${toState.x} ${toState.y}`}
                fillOpacity="0"
                strokeOpacity={activeId === t.id ? '0.3' : '0'}
                stroke="cyan"
                strokeWidth={strokeWidth * 3}
            />

            <path
                d={`M ${fromState.x} ${fromState.y} Q ${curvePos.x + t.curveX} ${curvePos.y + t.curveY} ${toState.x} ${toState.y}`}
                fillOpacity="0"
                stroke="black"
                strokeWidth={strokeWidth}
                markerEnd="url(#arrow)"
            />

            {activeId === t.id && (
                <circle
                    cx={curvePos.x}
                    cy={curvePos.y}
                    r={rad / 4}
                    stroke="black"
                    strokeWidth={strokeWidth / 2}
                    fill="white"
                />
            )}
            <text
                className="svgText"
                x={curvePos.x + (t.curveX >= 0 ? 30 : -30)}
                y={curvePos.y + (t.curveY >= 0 ? 20 : -10)}
                textAnchor="middle"
            >
                {t.write
                    ? t.read + '/' + t.write + ';' + t.move
                    : t.read + ';' + t.move}
            </text>
        </ g>
    );
}

export default TMTransition;
