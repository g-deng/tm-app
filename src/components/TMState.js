import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function TMState({ s, activeId, setActiveId, trigger, setTrigger, clickable }) {
    const rad = 20;
    const onStateClick = (e) => {
        if (!clickable)
            return;
        e.stopPropagation();
        if (e.ctrlKey) {
            const label = window.prompt('Enter new label');
            if (label !== null && label !== '')
                s.label = label;
        }
        setTrigger(!trigger);
        setActiveId(s.id);
    };
    const isActive = activeId === s.id;
    return (_jsxs(_Fragment, { children: [_jsx("defs", { children: _jsxs("radialGradient", { id: "myGradient", children: [_jsx("stop", { offset: "0%", stopColor: "cyan", stopOpacity: "1" }), _jsx("stop", { offset: "100%", stopColor: "cyan", stopOpacity: "0" })] }) }), isActive && (_jsx("circle", { cx: s.x, cy: s.y, r: rad + 10, fill: "url(#myGradient)" }, 'g' + s.id)), _jsx("circle", { cx: s.x, cy: s.y, r: rad, onClick: onStateClick, fill: "gray", stroke: "black" }, s.id), _jsx("text", { className: "svgText", x: s.x - rad / 2, y: s.y + 5, textLength: rad, onClick: onStateClick, children: s.label }, 't' + s.id)] }));
}
export default TMState;
