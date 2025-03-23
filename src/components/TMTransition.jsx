function TMTransition({ t, states, active, setActive}) {
    const rad = 20;
    const strokeWidth = 3;
    
    const onTransitionClick = (e, id) => {
        e.stopPropagation();
        setActive(id);
        // window.alert(`clicked transition ${id}`);
    };

    const fromState = states.find((s) => s.id === t.from);
    const toState = states.find((s) => s.id === t.to);
    const distX = (toState.x - fromState.x);
    const distY = (toState.y - fromState.y);
    const dist = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2));

    return (
        <>
            <line key={'g'+t.id} x1={fromState.x} x2={toState.x-distX*(rad+3*strokeWidth)/dist} 
            y1={fromState.y} y2={toState.y-distY*(rad+3*strokeWidth)/dist} 
            strokeOpacity={(active === t.id) ? '0.3' : '0'} stroke='cyan' strokeWidth={strokeWidth*3}
            onClick={(e) => onTransitionClick(e, t.id)} />

            <line key={t.id} x1={fromState.x} x2={toState.x-distX*(rad+3*strokeWidth)/dist} 
            y1={fromState.y} y2={toState.y-distY*(rad+3*strokeWidth)/dist} 
            stroke="black" strokeWidth={strokeWidth} markerEnd="url(#arrow)"/>
            <text className='svgText' key={'t'+t.id} x={fromState.x + distX/2} y={fromState.y+distY/2 - rad} onClick={(e) => onTransitionClick(e, t.id)}>{t.label}</text>
        </>
    );
}

export default TMTransition;