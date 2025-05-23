import { StateData, TransitionData } from '../types/elems';
import { useState, useEffect } from 'react';
import EditableField from './EditableField';

interface TMTransitionPopupProps {
    activeId: number | null;
    states: StateData[];
    transition: TransitionData | null;
    onUpdateTransition: (updatedTransition: TransitionData) => void;
    onDeleteTransition: (id: number) => void;
    setActiveId: (id: number | null) => void;
    containerWidth: number;
}

function TMTransitionPopup({
    activeId,
    states,
    transition,
    onUpdateTransition,
    onDeleteTransition,
    setActiveId,
    containerWidth,
} : TMTransitionPopupProps) {    
    const [read, setRead] = useState(transition?.read.join(",") || '');
    const [write, setWrite] = useState(transition?.write || '');
    const [move, setMove] = useState(transition?.move || 'R');
    const menuWidth = 250;
    const menuHeight = 300;
    const padding = 15;
    const cornerRadius = 8;
    const itemHeight = 30;

    // Sync internal state when transition changes
    useEffect(() => {
        if (transition) {
            setRead(transition.read.join(",") || '');
            setWrite(transition.write || '');
            setMove(transition.move || 'R');
        }
    }, [transition, activeId]);
    
    if (transition == null) return <></>;
    
    const handleReadSave = (editValue: string) => {
        if (!editValue || editValue.trim() === '') {
            alert('Read symbol cannot be empty');
            return;
        }
        const editValueSplit = editValue.split(',');
        for (let i = 0; i < editValueSplit.length; i++) {
            if (editValueSplit[i].length !== 1) {
                alert('Read symbol must be a single character');
                return;
            }
        }
        const updatedTransition = transition;
        updatedTransition.read = editValueSplit;
        console.log('updatedTransition', updatedTransition);
        onUpdateTransition(updatedTransition);
        setRead(editValue);
    };

    const handleWriteSave = (editValue: string) => {
        const updatedTransition = transition;
        if (editValue.length > 1) {
            alert('Write symbol must be a single character');
            return;
        } else if (editValue.length < 1) {
            updatedTransition.write = null;
        } else {
            updatedTransition.write = editValue;
        }
        console.log('updatedTransition', updatedTransition);
        onUpdateTransition(updatedTransition);
        setWrite(editValue);
    };

    const handleMoveChange = (newMove: 'L' | 'R') => {
        const updatedTransition = transition;
        updatedTransition.move = newMove;
        console.log('updatedTransition', updatedTransition);
        onUpdateTransition(updatedTransition);
        setMove(newMove);
    };
    
    const positionX = containerWidth - menuWidth - padding;
    const positionY = padding;
    
    const fromState = states.find(s => s.id === transition.from);
    const toState = states.find(s => s.id === transition.to);
    
    return (
        <g transform={`translate(${positionX}, ${positionY})`}>
            {/* Background rectangle with rounded corners */}
            <rect
                width={menuWidth}
                height={menuHeight}
                rx={cornerRadius}
                ry={cornerRadius}
                fill="#ffffff"
                stroke="#cccccc"
                strokeWidth={1.0}
            />
            
            {/* Title */}
            <text
                x={menuWidth / 2}
                y={padding * 1.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#333333"
                fontSize={16}
                fontWeight="bold"
            >
                Transition
            </text>

            {/* Close button */}
            <text
                x={menuWidth - padding}
                y={padding * 1.5}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#bbbbbb"
                fontSize={16}
                onClick={()=>setActiveId(null)}
                style={{ cursor: 'pointer' }}
            >
                Close
            </text>
            
            {/* Separator line under title */}
            <line
                x1={padding}
                y1={padding * 2.5}
                x2={menuWidth - padding}
                y2={padding * 2.5}
                stroke="#eeeeee"
                strokeWidth={1}
            />
            
            {/* States section */}
            <g transform={`translate(0, ${padding * 3})`}>
                <text
                    x={padding}
                    y={itemHeight / 2}
                    dominantBaseline="middle"
                    fill="#666666"
                    fontSize={16}
                >
                    From: {fromState?.label || transition.from}
                </text>
                <text
                    x={padding}
                    y={itemHeight * 1.5}
                    dominantBaseline="middle"
                    fill="#666666"
                    fontSize={16}
                >
                    To: {toState?.label || transition.to}
                </text>
            </g>
            
            {/* Read section */}
            <g transform={`translate(0, ${padding * 3 + itemHeight * 2.5})`}>
                <text
                    x={padding}
                    y={itemHeight / 2}
                    dominantBaseline="middle"
                    fill="#666666"
                    fontSize={16}
                >
                    Read:
                </text>
                
                <EditableField
                    value={read}
                    onSave={handleReadSave}
                    x={padding + 50}
                    y={0}
                    width={menuWidth - padding * 3 - 50}
                    height={itemHeight}
                />
            </g>
            
            {/* Write section */}
            <g transform={`translate(0, ${padding * 3 + itemHeight * 4})`}>
                <text
                    x={padding}
                    y={itemHeight / 2}
                    dominantBaseline="middle"
                    fill="#666666"
                    fontSize={16}
                >
                    Write:
                </text>
                
                <EditableField
                    value={write}
                    onSave={handleWriteSave}
                    x={padding + 50}
                    y={0}
                    width={menuWidth - padding * 3 - 50}
                    height={itemHeight}
                />
            </g>
            
            {/* Move section */}
            <g transform={`translate(0, ${padding * 3 + itemHeight * 5.5})`}>
                <text
                    x={padding}
                    y={itemHeight / 2}
                    dominantBaseline="middle"
                    fill="#666666"
                    fontSize={16}
                >
                    Move:
                </text>
                
                {/* Left button */}
                <g onClick={() => handleMoveChange('L')} style={{ cursor: 'pointer' }}>
                    <rect
                        x={padding + 50}
                        y={5}
                        width={20}
                        height={20}
                        rx={10}
                        ry={10}
                        fill={move === 'L' ? '#2196F3' : '#eeeeee'}
                        stroke="#bbbbbb"
                    />
                    <text
                        x={padding + 60}
                        y={itemHeight / 2}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill={move === 'L' ? '#ffffff' : '#666666'}
                        fontSize={16}
                    >
                        L
                    </text>
                </g>
                
                {/* Right button */}
                <g onClick={() => handleMoveChange('R')} style={{ cursor: 'pointer' }}>
                    <rect
                        x={padding + 80}
                        y={5}
                        width={20}
                        height={20}
                        rx={10}
                        ry={10}
                        fill={move === 'R' ? '#2196F3' : '#eeeeee'}
                        stroke="#bbbbbb"
                    />
                    <text
                        x={padding + 90}
                        y={itemHeight / 2}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill={move === 'R' ? '#ffffff' : '#666666'}
                        fontSize={16}
                    >
                        R
                    </text>
                </g>
            </g>
                
            {/* Delete Transition button */}
            <g
                onClick={() => onDeleteTransition(transition.id)}
                transform={`translate(0, ${menuHeight - padding - itemHeight})`}
                style={{ cursor: 'pointer' }}
            >
                <rect
                    x={padding}
                    y={0}
                    width={menuWidth - padding * 2}
                    height={itemHeight}
                    rx={cornerRadius}
                    ry={cornerRadius}
                    fill="#ffebee"
                    stroke="#ef9a9a"
                />
                <text
                    x={menuWidth / 2}
                    y={itemHeight / 2 + 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#d32f2f"
                    fontSize={14}
                    fontWeight="bold"
                >
                    Delete Transition
                </text>
            </g>
        </g>
    );
}
    
export default TMTransitionPopup;