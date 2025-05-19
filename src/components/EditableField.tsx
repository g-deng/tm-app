import { useEffect, useRef, useState } from 'react';

interface EditableFieldProps {
    value: string;
    onSave: (val: string) => void;
    x: number;
    y: number;
    width: number;
    height: number;
}

function EditableField({ value, onSave, x, y, width, height }: EditableFieldProps) {
    const [editValue, setEditValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) inputRef.current.focus();
    }, [isEditing]);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const handleBlur = () => {
        // delay to allow click handlers to run first
        blurTimeoutRef.current = setTimeout(() => {
            setIsEditing(false);
            setEditValue(value); // cancel edit
        }, 150);
    };

    const cancelBlurTimeout = () => {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }
    };

    return (
        <g transform={`translate(${x}, ${y})`}>
            <foreignObject x={0} y={0} width={width} height={height}>
                <input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => {
                        setIsEditing(true);
                        setEditValue(e.target.value);
                    }}
                    onBlur={handleBlur}
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '2px',
                        fontSize: 16,
                        fill: '#666666',
                    }}
                />
            </foreignObject>
            {isEditing && (
                <>
                    <text
                        x={width - 40}
                        y={height / 2}
                        fill="#4CAF50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ cursor: 'pointer' }}
                        onMouseDown={cancelBlurTimeout}
                        onClick={() => {
                            cancelBlurTimeout();
                            onSave(editValue);
                            setIsEditing(false);
                        }}
                    >
                        ✓
                    </text>
                    <text
                        x={width - 20}
                        y={height / 2}
                        fill="#f44336"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ cursor: 'pointer' }}
                        onMouseDown={cancelBlurTimeout}
                        onClick={() => {
                            setIsEditing(false);
                            setEditValue(value);
                        }}
                    >
                        ✕
                    </text>
                </>
            )}
        </g>
    );
}

export default EditableField;
