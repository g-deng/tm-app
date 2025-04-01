import { useEffect, useRef } from 'react';

function Tape({ states, testState }) {
    const tapeRef = useRef(null);
    const cellSize = 30;
    const offBy = 20;

    useEffect(() => {
        if (tapeRef.current) {
            if (testState && testState.pointer) {
                tapeRef.current.scrollTo({
                    left: (testState.pointer + offBy) * cellSize - 250,
                    behavior: "smooth"
                });
            } else {
                tapeRef.current.scrollTo({
                    left: (offBy) * cellSize - 250,
                    behavior: "smooth"
                });
            }
        }
    }, [testState]);


    const inputArray = (testState) ? testState.tape : [];
    const tapeArray = [...Array(offBy), ...inputArray, ...Array(Math.max(offBy + 1 - inputArray.length, 0))];

    const numChars = tapeArray.length;

    return (
        <div className="tape-container" ref={tapeRef}>
            <svg width={Math.max(numChars * cellSize, 500)} height="60px"> 
                {tapeArray.map((c, i) => (
                    <g>
                        <rect 
                            key={i} 
                            x={i * cellSize} 
                            y="10" 
                            width="48" 
                            height="40" 
                            fill={(testState && testState.pointer === i-offBy) ? "cyan" : "white"}
                            stroke="black"
                        />
                        <text 
                            className='svgText' 
                            x={i*cellSize + cellSize/2} 
                            y="25" 
                            textAnchor="middle"
                            fontSize={12}
                        >{i - offBy}</text>
                        <text 
                            className='svgText' 
                            x={i*cellSize + cellSize/2} 
                            y="40" 
                            textAnchor="middle"
                            stroke="black"
                        >{c}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
export default Tape;
