function Tape({ states, testState }) {
    const inputArray = (testState) ? testState.tape.split("") : [];
    const extraArray = [...Array(Math.max(20 - inputArray.length, 3))];
    const tapeArray = inputArray.concat(extraArray);
    tapeArray.unshift(' ', ' ', ' ');

    const numChars = tapeArray.length;

    return (
        <div className="tape-container">
            <svg width={Math.max(numChars * 25, 500)} height="60px"> 
                {tapeArray.map((c, i) => (
                    <>
                        <rect 
                            key={i} 
                            x={i * 25} 
                            y="10" 
                            width="48" 
                            height="40" 
                            fill={(testState && testState.pointer === i-3) ? "cyan" : "white"}
                            stroke="black"
                        />
                        <text 
                            className='svgText' 
                            x={i*25 + 8} 
                            y="25" 
                            fontSize={12}
                        >{i - 3}</text>
                        <text 
                            className='svgText' 
                            x={i*25 + 5} 
                            y="40" 
                            stroke="black"
                        >{c}</text>
                    </>
                ))}
            </svg>
        </div>
    );
}
export default Tape;
