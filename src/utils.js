function getById(list, id) {
    return list.find((elem) => elem.id === id);
}
function euclid(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}
/**
 * Returns the closest location to pos outside of the circle defined by (cx, cy, r).
 */
function closestOutOfRadius(p, c, rad) {
    if (euclid(p.x, p.y, c.x, c.y) < rad) {
        const distc = euclid(p.x, p.y, c.x, c.y);
        return { x: c.x + (p.x - c.x) * rad / distc, y: c.y + (p.y - c.y) * rad / distc };
    }
    else {
        return { x: p.x, y: p.y };
    }
}
function evalQuadBezier(sp, cp, ep, t) {
    const x = (1 - t) ** 2 * sp.x + 2 * (1 - t) * t * cp.x + t ** 2 * ep.x;
    const y = (1 - t) ** 2 * sp.y + 2 * (1 - t) * t * cp.y + t ** 2 * ep.y;
    return { x, y };
}
function evalQuadBezierDerivative(sp, cp, ep, t) {
    const dx = 2 * (1 - t) * (cp.x - sp.x) + 2 * t * (ep.x - cp.x);
    const dy = 2 * (1 - t) * (cp.y - sp.y) + 2 * t * (ep.y - cp.y);
    return { dx, dy };
}
export { getById, euclid, closestOutOfRadius, };
