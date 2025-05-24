import { Dispatch, SetStateAction } from "react";
import { TransitionData } from "../types/elems";

interface TMTransitionContextProps {
    contextTransition: {x: number, y: number, transition: TransitionData} | null;
    deleteTransition: (id: number) => void;
    setActiveId: Dispatch<SetStateAction<number | null>>;
}

function TMTransitionContext({ contextTransition, deleteTransition, setActiveId } : TMTransitionContextProps) {
    if (contextTransition == null) return <></>;
    
    const itemHeight = 30;
    const cornerRadius = 5;
    const menuWidth = 120;
    const menuHeight = itemHeight * 2;

    const focus = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    const handleDelete = (e: React.MouseEvent) => {
        console.log('Delete transition', contextTransition.transition);
        e.stopPropagation();
        deleteTransition(contextTransition.transition.id);
    }

    const handleEdit = (e: React.MouseEvent) => {
        console.log('Edit transition', contextTransition.transition);
        e.stopPropagation();
        setActiveId(contextTransition.transition.id);
    }

    // menu's upper left corner
    // const x = transition.curveX + rad + 10;
    // const y = transition.curveY - menuHeight;

    return (
        <g 
            transform={`translate(${contextTransition.x}, ${contextTransition.y})`}
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
        
        {/* Delete */}
        <g onClick={handleDelete} style={{ cursor: 'pointer' }}>
            <rect
            x={0}
            y={itemHeight * 1}
            width={menuWidth}
            height={itemHeight}
            fill="transparent"
            />
            <text
            x={menuWidth / 2}
            y={itemHeight * 1.5}
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
        </g>
    );
}

export default TMTransitionContext;
