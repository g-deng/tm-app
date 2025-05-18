import { StateData, TransitionData } from '../types/elems';
import { useState, useRef, useEffect } from 'react';

interface TMStatePopupProps {
    initialLabel: string | undefined;
    activeId: number | null;
    states: StateData[];
    transitions: TransitionData[];
    onLabelUpdate: (newLabel: string) => void;
    onAddTransition: (state: StateData) => void;
    onDeleteTransition: (id: number) => void;
    onDeleteState: () => void;
    onTransitionClick: (id: number) => void;
    setActiveId: (id: number | null) => void;
    containerWidth: number;
}

function TMStatePopup({
    initialLabel,
    activeId,
    states,
    transitions,
    onLabelUpdate,
    onAddTransition,
    onDeleteTransition,
    onDeleteState,
    onTransitionClick,
    setActiveId,
    containerWidth,
} : TMStatePopupProps) {    
    const [label, setLabel] = useState(initialLabel);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(initialLabel);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuWidth = 250;
    const menuHeight = 300;
    const padding = 15;
    const cornerRadius = 8;
    const itemHeight = 30;
    const transitionItemHeight = 25;
    const transitionMargin = 5;

    // Sync internal state when initialLabel changes
    useEffect(() => {
        setLabel(initialLabel);
        setEditValue(initialLabel);
        setIsEditing(false);
    }, [initialLabel, activeId]);
    
    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const state = states.find((s) => s.id === activeId);
    const stateTransitions = transitions.filter((t) => t.from === activeId);
    
    if (state == null) return <></>;

    
    const handleEditStart = () => {
        setEditValue(label);
        setIsEditing(true);
    };
    
    const handleEditCancel = () => {
        setIsEditing(false);
    };
    
    const handleEditSave = () => {
        if (!editValue || editValue.trim() === '') {
            alert('Label cannot be empty');
            return;
        }
        onLabelUpdate(editValue);
        setLabel(editValue);
        setIsEditing(false);
    };
    
    const positionX = containerWidth - menuWidth - padding;
    const positionY = padding;
    
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
                State
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
            
            {/* Label section */}
            <g transform={`translate(0, ${padding * 3})`}>
                <text
                    x={padding}
                    y={itemHeight / 2}
                    dominantBaseline="middle"
                    fill="#666666"
                    fontSize={16}
                >
                    Label:
                </text>
                
                {isEditing ? (
                    <>
                        <foreignObject x={padding + 50} y={0} width={120} height={itemHeight}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '0 5px',
                            }}
                        />
                        </foreignObject>
                        <g onClick={handleEditSave} style={{ cursor: 'pointer' }}>
                            <rect
                                x={menuWidth - padding - 50}
                                y={5}
                                width={20}
                                height={20}
                                rx={4}
                                ry={4}
                                fill="#4CAF50"
                            />
                            <text
                                x={menuWidth - padding - 40}
                                y={itemHeight / 2}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize={16}
                            >
                                ✓
                            </text>
                        </g>
                        <g onClick={handleEditCancel} style={{ cursor: 'pointer' }}>
                            <rect
                                x={menuWidth - padding - 25}
                                y={5}
                                width={20}
                                height={20}
                                rx={4}
                                ry={4}
                                fill="#f44336"
                            />
                            <text
                                x={menuWidth - padding - 15}
                                y={itemHeight / 2}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize={16}
                            >
                                x
                            </text>
                        </g>
                    </>
                ) : (
                    <>
                        <text
                            x={padding + 50}
                            y={itemHeight / 2}
                            dominantBaseline="middle"
                            fill="#333333"
                            fontSize={16}
                            onClick={handleEditStart}
                            style={{ cursor: 'text' }}
                        >
                            {label}
                        </text>
                    </>
                )}
            </g>
            
            {/* Transitions section */}
            <g transform={`translate(0, ${padding * 3 + itemHeight * 1.5})`}>
                <text
                    x={padding}
                    y={itemHeight / 2}
                    dominantBaseline="middle"
                    fill="#666666"
                    fontSize={16}
                >
                    Transitions:
                </text>
                
                <g onClick={() => onAddTransition(state)} style={{ cursor: 'pointer' }}>
                    <rect
                        x={menuWidth - padding - 25}
                        y={5}
                        width={20}
                        height={20}
                        rx={4}
                        ry={4}
                        fill="#2196F3"
                    />
                    <text
                        x={menuWidth - padding - 15}
                        y={itemHeight / 2}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={16}
                    >
                    +
                    </text>
                </g>
                
                {/* List of transitions */}
                <g transform={`translate(0, ${itemHeight + 5})`}>
                    {stateTransitions.map((t, index) => (
                        <g
                            key={t.id}
                            transform={`translate(0, ${index * (transitionItemHeight + transitionMargin)})`}
                        >
                            <g onClick={() => onTransitionClick(t.id)} style={{ cursor: 'pointer' }}>
                                <rect
                                    x={padding}
                                    y={0}
                                    width={menuWidth - padding * 3 - 40}
                                    height={transitionItemHeight}
                                    rx={transitionItemHeight / 2}
                                    ry={transitionItemHeight / 2}
                                    fill="#e3f2fd"
                                    stroke="#bbdefb"
                                />
                                <text
                                    x={padding + 10}
                                    y={transitionItemHeight / 2}
                                    dominantBaseline="middle"
                                    fill="#1976d2"
                                    fontSize={16}
                                >
                                    {(t.write
                                        ? t.read + '/' + t.write + ';' + t.move
                                        : t.read + ';' + t.move) + 
                                    ' -> ' + states.find((s) => s.id === t.to)?.label
                                    }
                                </text>
                            </g>
                            <g
                                onClick={() => onDeleteTransition(t.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <rect
                                    x={menuWidth - padding - 40}
                                    y={0}
                                    width={40}
                                    height={transitionItemHeight}
                                    rx={transitionItemHeight / 2}
                                    ry={transitionItemHeight / 2}
                                    fill="#ffcdd2"
                                    stroke="#ef9a9a"
                                />
                                <text
                                    x={menuWidth - padding - 20}
                                    y={transitionItemHeight / 2}
                                    dominantBaseline="middle"
                                    textAnchor="middle"
                                    fill="#d32f2f"
                                    fontSize={16}
                                >
                                Del
                                </text>
                            </g>
                        </g>
                    ))}
                </g>
            </g>
                
            {/* Delete State button */}
            <g
                onClick={onDeleteState}
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
                    Delete State
                </text>
            </g>
        </g>
    );
    };
    
    export default TMStatePopup;