import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function TMStateContext({ id, states, deleteState, setTransitionFrom }) {
    const rad = 20;
    const s = states.find((s) => s.id === id);
    if (s == null)
        return _jsx(_Fragment, {});
    return (_jsxs(_Fragment, { children: [_jsx("circle", { cx: s.x + rad + 8, cy: s.y - rad, r: 5, onMouseDown: () => setTransitionFrom(s), fillOpacity: "0", stroke: "blue" }, 'a' + id), _jsx("circle", { cx: s.x + rad + 23, cy: s.y - rad, r: 5, onClick: () => deleteState(id), fillOpacity: "0", stroke: "red" }, 'd' + id)] }));
}
export default TMStateContext;
