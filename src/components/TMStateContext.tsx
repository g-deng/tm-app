import { Dispatch, SetStateAction } from "react";
import { StateData } from "../types/elems";

interface TMStateContextProps {
    id: number;
    states: StateData[];
    deleteState: (id: number) => void;
    setTransitionFrom: Dispatch<SetStateAction<StateData | null>>;
}

function TMStateContext({ id, states, deleteState, setTransitionFrom } : TMStateContextProps) {
    const rad = 20;

    const s = states.find((s) => s.id === id);
    if (s == null) return <></>;
    
    const itemHeight = 30;
    const cornerRadius = 5;
    const menuWidth = 120;
    const menuHeight = itemHeight * 3;

    // menu's upper left corner
    const x = s.x + rad + 10;
    const y = s.y - menuHeight;

    return (
        <g transform={`translate(${x}, ${y})`}>
        <rect
            width={menuWidth}
            height={menuHeight}
            rx={cornerRadius}
            ry={cornerRadius}
            fill="#ffffff"
            stroke="#cccccc"
            strokeWidth={1}
        />
        
        {/* Edit */}
        <g onClick={()=>{}} style={{ cursor: 'pointer' }}>
            <rect
            x={0}
            y={0}
            width={menuWidth}
            height={itemHeight}
            fill="transparent"
            />
            <text
            x={menuWidth / 2}
            y={itemHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#333333"
            fontSize={14}
            >
            Edit
            </text>
        </g>
        
        {/* Add Transition */}
        <g onClick={()=>setTransitionFrom(s)} style={{ cursor: 'pointer' }}>
            <rect
            x={0}
            y={itemHeight}
            width={menuWidth}
            height={itemHeight}
            fill="transparent"
            />
            <text
            x={menuWidth / 2}
            y={itemHeight * 1.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#333333"
            fontSize={14}
            >
            Add Transition
            </text>
        </g>
        
        {/* Delete */}
        <g onClick={()=>deleteState(id)} style={{ cursor: 'pointer' }}>
            <rect
            x={0}
            y={itemHeight * 2}
            width={menuWidth}
            height={itemHeight}
            fill="transparent"
            />
            <text
            x={menuWidth / 2}
            y={itemHeight * 2.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ff4444"
            fontSize={14}
            >
            Delete
            </text>
        </g>
        
        {/* Separator lines */}
        <line
            x1={5}
            y1={itemHeight}
            x2={menuWidth - 5}
            y2={itemHeight}
            stroke="#eeeeee"
            strokeWidth={1}
        />
        <line
            x1={5}
            y1={itemHeight * 2}
            x2={menuWidth - 5}
            y2={itemHeight * 2}
            stroke="#eeeeee"
            strokeWidth={1}
        />
        </g>
    );
}

export default TMStateContext;
