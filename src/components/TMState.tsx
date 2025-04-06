import { StateData } from "../types/elems";

interface TMStateProps {
    s: StateData;
    activeId: number | null;
    setActiveId: React.Dispatch<React.SetStateAction<number|null>>;
    trigger: boolean;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
    clickable: boolean;
}

function TMState({ s, activeId, setActiveId, trigger, setTrigger, clickable } : TMStateProps) {
    const rad = 20;

    const onStateClick = (e: React.MouseEvent) => {
        if (!clickable) return;

        e.stopPropagation();

        if (e.ctrlKey) {
            const label = window.prompt('Enter new label');
            if (label !== null && label !== '') s.label = label;
        }
        setTrigger(!trigger);
        setActiveId(s.id);
    };

    const isActive = activeId === s.id;

    return (
        <>
            <defs>
                <radialGradient id="myGradient">
                    <stop offset="0%" stopColor="cyan" stopOpacity="1" />
                    <stop offset="100%" stopColor="cyan" stopOpacity="0" />
                </radialGradient>
            </defs>
            {isActive && (
                <circle
                    key={'g' + s.id}
                    cx={s.x}
                    cy={s.y}
                    r={rad + 10}
                    fill="url(#myGradient)"
                />
            )}
            <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r={rad}
                onClick={onStateClick}
                fill="gray"
                stroke="black"
            />
            <text
                className="svgText"
                key={'t' + s.id}
                x={s.x - rad / 2}
                y={s.y + 5}
                textLength={rad}
                onClick={onStateClick}
            >
                {s.label}
            </text>
        </>
    );
}

export default TMState;
