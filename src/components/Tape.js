import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
function Tape({ states, testData, }) {
    const tapeRef = useRef(null);
    const cellSize = 30;
    const offBy = 20;
    useEffect(() => {
        if (tapeRef.current) {
            if (testData && testData.pointer) {
                tapeRef.current.scrollTo({
                    left: (testData.pointer + offBy) * cellSize - 250,
                    behavior: 'smooth',
                });
            }
            else {
                tapeRef.current.scrollTo({
                    left: offBy * cellSize - 250,
                    behavior: 'smooth',
                });
            }
        }
    }, [testData]);
    const inputArray = testData ? testData.tape : [];
    const tapeArray = [
        ...Array(offBy),
        ...inputArray,
        ...Array(Math.max(offBy + 1 - inputArray.length, 0)),
    ];
    const numChars = tapeArray.length;
    return (_jsx("div", { className: "tape-container", ref: tapeRef, children: _jsx("svg", { width: Math.max(numChars * cellSize, 500), height: "60px", children: tapeArray.map((c, i) => (_jsxs("g", { children: [_jsx("rect", { x: i * cellSize, y: "10", width: "48", height: "40", fill: testData && testData.pointer === i - offBy
                            ? 'cyan'
                            : 'white', stroke: "black" }, i), _jsx("text", { className: "svgText", x: i * cellSize + cellSize / 2, y: "25", textAnchor: "middle", fontSize: 12, children: i - offBy }), _jsx("text", { className: "svgText", x: i * cellSize + cellSize / 2, y: "40", textAnchor: "middle", stroke: "black", children: c })] }))) }) }));
}
export default Tape;
