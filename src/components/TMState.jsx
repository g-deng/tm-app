function TMState({ 
    s, active, setActive
 }) {
    const rad = 20;

    const onStateClick = (e, id) => {
        e.stopPropagation();
        setActive(id);
        console.log('hi');
    };

    const isActive = active === s.id;

    return (
        <>
            <defs>
                <radialGradient id="myGradient">
                <stop offset="0%" stopColor="cyan" stopOpacity="1"/>
                <stop offset="100%" stopColor="cyan" stopOpacity="0"/>
                </radialGradient>
            </defs>
            {(isActive && <circle key={'g'+s.id} cx={s.x} cy={s.y} r={rad+10} fill="url(#myGradient)"/>)}
            <circle key={s.id} cx={s.x} cy={s.y} r={rad} onClick={(e) => onStateClick(e, s.id)}
            fill='gray' stroke='black'/>
            <text className='svgText' key={'t'+s.id} x={s.x-rad/2} y={s.y+5} textLength={rad} onClick={(e) => onStateClick(e, s.id)}>{s.label}</text>
        </>
    );

}

export default TMState;