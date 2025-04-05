function TMStateContext({ id, states, deleteState, setTransitionFrom }) {
    const rad = 20;

    const s = states.find((s) => s.id === id);
    if (s == null) return <></>;

    return (
        <>
            <circle
                key={'a' + id}
                cx={s.x + rad + 8}
                cy={s.y - rad}
                r={5}
                onMouseDown={() => setTransitionFrom(s)}
                fillOpacity="0"
                stroke="blue"
            />
            <circle
                key={'d' + id}
                cx={s.x + rad + 23}
                cy={s.y - rad}
                r={5}
                onClick={() => deleteState(id)}
                fillOpacity="0"
                stroke="red"
            />
        </>
    );
}

export default TMStateContext;
