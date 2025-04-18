import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function InputOver({ x, y }) {
    const topDist = y + 10;
    const leftDist = x + 100;
    return (_jsxs("form", { style: {
            position: 'absolute',
            top: topDist,
            left: leftDist,
            zIndex: 100,
        }, children: [_jsx("input", { className: "mini-input", type: "text", style: { width: '40px' } }), "/", _jsx("input", { className: "mini-input", type: "text" }), ";", _jsx("input", { className: "mini-input", type: "text" })] }));
}
export default InputOver;
