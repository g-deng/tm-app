function InputOver({ x, y } : {x: number; y: number}) {
    const topDist = y + 10;
    const leftDist = x + 100;
    return (
        <form
            style={{
                position: 'absolute',
                top: topDist,
                left: leftDist,
                zIndex: 100,
            }}
        >
            <input
                className="mini-input"
                type="text"
                style={{ width: '40px' }}
            />
            /
            <input className="mini-input" type="text" />
            ;
            <input className="mini-input" type="text" />
        </form>
    );
}
export default InputOver;
