import { useEffect, useState } from 'react';
import TMState from './TMState.js';
import TMTransition from './TMTransition.js';
import { AppProps } from '../App.types.js';

function TestWindow({ states, transitions, testData, ...rest }: AppProps) {
    const [trigger, setTrigger] = useState(false);
    const [activeId, setActiveId] = useState<number | null>(null);

    useEffect(() => {
        if (testData?.stateId) setActiveId(testData.stateId);
        else setActiveId(null);
    }, [testData]);

    const drawTransitions = transitions.map((t) => (
        <TMTransition
            t={t}
            states={states}
            activeId={activeId}
            setActiveId={setActiveId}
            trigger={trigger}
            setTrigger={setTrigger}
            clickable={false}
        />
    ));

    const drawStates = states.map((s) => (
        <TMState
            s={s}
            activeId={activeId}
            setActiveId={setActiveId}
            trigger={trigger}
            setTrigger={setTrigger}
            clickable={false}
        />
    ));

    const onClick = () => {
        window.alert('Switch to Build mode to edit!');
    };

    return (
        <div className="window-div">
            <svg
                key="windowFrame"
                className="window"
                xmlns="http://www.w3.org/2000/svg"
                onClick={onClick}
            >
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    stroke="black"
                    strokeWidth="1"
                    fillOpacity="0"
                />
                {drawTransitions}
                {drawStates}
            </svg>
        </div>
    );
}

export default TestWindow;
