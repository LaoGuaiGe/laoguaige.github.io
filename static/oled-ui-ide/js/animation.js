const Animation = (() => {
    const UNLINEAR = 0;
    const PID_CURVE = 1;

    function changeFloat(state, speed, mode) {
        const dist = state.target - state.current;
        if (mode === UNLINEAR) {
            if (Math.abs(dist) < speed / 20) {
                state.current = state.target;
                state.error = 0;
                state.lastError = 0;
                state.integral = 0;
                state.derivative = 0;
            } else {
                state.current += 0.02 * speed * dist;
            }
        } else {
            const Kp = 0.02 * speed;
            const Ki = 0.005 * speed;
            const Kd = 0.002;
            state.error = state.target - state.current;
            state.integral += state.error;
            state.derivative = state.error - state.lastError;
            state.current += Kp * state.error + Ki * state.integral + Kd * state.derivative;
            state.lastError = state.error;
            if (Math.abs(state.error) < 0.5) {
                state.current = state.target;
            }
        }
    }

    function createDistance(initial) {
        return { current: initial || 0, target: initial || 0, error: 0, lastError: 0, integral: 0, derivative: 0 };
    }

    function createPoint(x, y) {
        return {
            x: createDistance(x || 0),
            y: createDistance(y || 0)
        };
    }

    function createArea(x, y, w, h) {
        return {
            x: createDistance(x || 0),
            y: createDistance(y || 0),
            w: createDistance(w || 0),
            h: createDistance(h || 0)
        };
    }

    function animateDistance(d, speed, mode) {
        changeFloat(d, speed, mode);
    }

    function animatePoint(p, speed, mode) {
        changeFloat(p.x, speed, mode);
        changeFloat(p.y, speed, mode);
    }

    function animateArea(a, speed, mode) {
        changeFloat(a.x, speed, mode);
        changeFloat(a.y, speed, mode);
        changeFloat(a.w, speed, mode);
        changeFloat(a.h, speed, mode);
    }

    function setDistanceTarget(d, val) { d.target = val; }
    function setPointTarget(p, x, y) { p.x.target = x; p.y.target = y; }
    function setAreaTarget(a, x, y, w, h) { a.x.target = x; a.y.target = y; a.w.target = w; a.h.target = h; }

    function resetDistance(d, val) {
        d.current = d.target = val;
        d.error = d.lastError = d.integral = d.derivative = 0;
    }

    function resetPoint(p, x, y) { resetDistance(p.x, x); resetDistance(p.y, y); }
    function resetArea(a, x, y, w, h) { resetDistance(a.x, x); resetDistance(a.y, y); resetDistance(a.w, w); resetDistance(a.h, h); }

    return {
        UNLINEAR, PID_CURVE,
        createDistance, createPoint, createArea,
        animateDistance, animatePoint, animateArea,
        setDistanceTarget, setPointTarget, setAreaTarget,
        resetDistance, resetPoint, resetArea
    };
})();
