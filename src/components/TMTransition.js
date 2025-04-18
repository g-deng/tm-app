import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function TMTransition({ t, states, activeId, setActiveId, trigger, setTrigger, clickable }) {
    const rad = 20;
    const strokeWidth = 3;
    const onTransitionClick = (e) => {
        e.stopPropagation();
        if (!clickable)
            return;
        if (e.ctrlKey) {
            let input = window.prompt('Enter new label');
            if (input == null || input === '')
                return;
            // check if format matches
            input = input.replace(/\s/g, '');
            const regex = new RegExp(/(?<read>(?:[^,],)*[^,])(?:\/(?<write>[^,]))?;(?<move>[LR])/);
            const matches = input.match(regex);
            if (matches && matches.groups &&
                regex.test(input) &&
                matches.groups.read &&
                matches.groups.move) {
                t.read = matches.groups.read.split(',');
                t.write = matches.groups.write;
                t.move = matches.groups.move;
            }
            console.log(t);
        }
        setTrigger(!trigger);
        setActiveId(t.id);
    };
    const fromState = states.find((s) => s.id === t.from);
    const toState = states.find((s) => s.id === t.to);
    if (fromState == null || toState == null)
        return _jsx(_Fragment, {});
    const distX = toState.x - fromState.x;
    const distY = toState.y - fromState.y;
    const curvePos = {
        x: fromState.x + distX / 2 + t.curveX,
        y: fromState.y + distY / 2 + t.curveY,
    };
    return (_jsxs(_Fragment, { children: [_jsx("marker", { id: "arrow", viewBox: "0 0 16 16", refX: rad + 12, refY: "8", markerWidth: "6", markerHeight: "6", markerUnits: "strokeWidth", orient: "auto-start-reverse", children: _jsx("path", { d: "M 0 0 L 16 8 L 0 16 z" }) }), _jsx("path", { d: `M ${fromState.x} ${fromState.y} Q ${curvePos.x + t.curveX} ${curvePos.y + t.curveY} ${toState.x} ${toState.y}`, fillOpacity: "0", strokeOpacity: activeId === t.id ? '0.3' : '0', stroke: "cyan", strokeWidth: strokeWidth * 3, onClick: (e) => onTransitionClick(e) }, 'g' + t.id), _jsx("path", { d: `M ${fromState.x} ${fromState.y} Q ${curvePos.x + t.curveX} ${curvePos.y + t.curveY} ${toState.x} ${toState.y}`, fillOpacity: "0", stroke: "black", strokeWidth: strokeWidth, onClick: (e) => onTransitionClick(e), markerEnd: "url(#arrow)" }, t.id), activeId === t.id && (_jsx("circle", { cx: curvePos.x, cy: curvePos.y, r: rad / 4, stroke: "black", strokeWidth: strokeWidth / 2, fill: "white" })), _jsx("text", { className: "svgText", x: curvePos.x + (t.curveX >= 0 ? 30 : -30), y: curvePos.y + (t.curveY >= 0 ? 20 : -10), textAnchor: "middle", onClick: (e) => onTransitionClick(e), children: t.write
                    ? t.read + '/' + t.write + ';' + t.move
                    : t.read + ';' + t.move }, 't' + t.id)] }));
}
export default TMTransition;
