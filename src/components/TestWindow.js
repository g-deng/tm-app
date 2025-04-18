import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import TMState from './TMState.js';
import TMTransition from './TMTransition.js';
function TestWindow({ states, transitions, testData, ...rest }) {
    const [trigger, setTrigger] = useState(false);
    const [activeId, setActiveId] = useState(null);
    useEffect(() => {
        if (testData?.stateId)
            setActiveId(testData.stateId);
        else
            setActiveId(null);
    }, [testData]);
    const drawTransitions = transitions.map((t) => (_jsx(TMTransition, { t: t, states: states, activeId: activeId, setActiveId: setActiveId, trigger: trigger, setTrigger: setTrigger, clickable: false })));
    const drawStates = states.map((s) => (_jsx(TMState, { s: s, activeId: activeId, setActiveId: setActiveId, trigger: trigger, setTrigger: setTrigger, clickable: false })));
    const onClick = () => {
        window.alert('Switch to Build mode to edit!');
    };
    return (_jsx("div", { className: "window-div", children: _jsxs("svg", { className: "window", xmlns: "http://www.w3.org/2000/svg", onClick: onClick, children: [_jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", stroke: "black", strokeWidth: "1", fillOpacity: "0" }), drawTransitions, drawStates] }, "windowFrame") }));
}
export default TestWindow;
