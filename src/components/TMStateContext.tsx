import { Dispatch, SetStateAction } from "react";
import { StateData } from "../types/elems";

interface TMStateContextProps {
    contextState: {state: StateData, x: number, y: number} | null;
    deleteState: (id: number) => void;
    setTransitionFrom: Dispatch<SetStateAction<StateData | null>>;
    setActiveId: Dispatch<SetStateAction<number | null>>;
}

function TMStateContext({ contextState, deleteState, setTransitionFrom, setActiveId } : TMStateContextProps) {
    const rad = 20;

    if (contextState == null) return <></>;
    
    const itemHeight = 30;
    const cornerRadius = 5;
    const menuWidth = 120;
    const menuHeight = itemHeight * 3;

    // menu's upper left corner
    const x = contextState.state.x + rad + 10;
    const y = contextState.state.y - menuHeight;

    const focus = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    const handleDelete = (e: React.MouseEvent) => {
        console.log('Delete state', contextState.state);
        e.stopPropagation();
        deleteState(contextState.state.id);
    }

    const handleEdit = (e: React.MouseEvent) => {
        console.log('Edit state', contextState.state);
        e.stopPropagation();
        setActiveId(contextState.state.id);
    }

    const handleAddTransition = (e: React.MouseEvent) => {
        console.log('Add transition from state', contextState.state);
        e.stopPropagation();
        setTransitionFrom(contextState.state);
    }

    return (
        <g transform={`translate(${x}, ${y})`}
            onMouseDown={focus}
        >
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
        <g onClick={handleEdit} style={{ cursor: 'pointer' }}>
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
        <g onClick={handleAddTransition} style={{ cursor: 'pointer' }}>
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
        <g onClick={handleDelete} style={{ cursor: 'pointer' }}>
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
