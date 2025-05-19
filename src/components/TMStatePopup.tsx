import { StateData, TransitionData } from '../types/elems';
import { useState, useEffect } from 'react';
import EditableField from './EditableField';

interface TMStatePopupProps {
    initialLabel: string | null;
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
    }, [initialLabel, activeId]);
    

    const state = states.find((s) => s.id === activeId);
    const stateTransitions = transitions.filter((t) => t.from === activeId);
    
    if (state == null) return <></>;
    
    const handleEditSave = (editValue: string) => {
        if (!editValue || editValue.trim() === '') {
            alert('Label cannot be empty');
            return;
        }
        onLabelUpdate(editValue);
        setLabel(editValue);
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
                
                <EditableField
                    value={label || ""}
                    onSave={handleEditSave}
                    x = {padding + 50}
                    y = {0}
                    width = {menuWidth - padding * 3 - 50}
                    height = {itemHeight}
                />
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