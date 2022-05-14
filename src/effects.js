import { getBrightness } from './util';

const q = (selector) => document.querySelector(selector);

const htmlEl = q('html');

export function setStyles(styles) {
    document.getElementById('newt-styles').innerText = styles;
}

export function setScrollbarColor(bgColor) {
    htmlEl.style.scrollbarColor =
        `${getBrightness(bgColor) < 120 ? '#404040' : '#999999'} ${bgColor}`;
}

export function setWindowScroll({ x, y }) {
    requestAnimationFrame(() =>
        window.scrollTo(x, y)
    );
}

export function registerScrollListener(callback) {
    document.addEventListener('scroll', callback);
}

export function registerListeners(events) {
    Object.entries(events).map(([event, callback]) =>
        document.addEventListener(event, callback)
    );
}

export function setHtmlOverflow(lock) {
    htmlEl.style.overflow = lock ? 'hidden' : 'auto';
}

export function enableScrolling(isDisabled) {
    let isCtrl = false;
    let isStageDraggable = false;
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let vel = { x: 0, y: 0 };
    let momentumId = null;

    const trackingLoop = () => {
        htmlEl.scrollLeft += vel.x;
        htmlEl.scrollTop += vel.y;
        vel.x *= 0.95;
        vel.y *= 0.95;

        if (Math.abs(vel.x) > 0.5 || Math.abs(vel.y) > 0.5) {
            momentumId = requestAnimationFrame(trackingLoop);
        }
    }

    const cancelTracking = () => {
        cancelAnimationFrame(momentumId);
    };

    const beginTracking = () => {
        cancelTracking();
        momentumId = requestAnimationFrame(trackingLoop);
    };

    document.addEventListener('keydown', (ev) => {
        if (ev.key == 'Control') isCtrl = true;
    });

    document.addEventListener('keyup', (ev) => {
        if (ev.key == 'Control') {
            isCtrl = false;
            isStageDraggable = false;
        }
    });

    htmlEl.addEventListener('wheel', cancelTracking);

    htmlEl.addEventListener('mousedown', (ev) => {
        if (isDisabled()) return;
        if (isCtrl && ev.button == 0) {
            isStageDraggable = true;
            pos = {
                ...pos,
                left: htmlEl.scrollLeft,
                top: htmlEl.scrollTop,
                x: ev.clientX,
                y: ev.clientY
            };
            cancelTracking();
        }
    });

    htmlEl.addEventListener('mousemove', (ev) => {
        if (!isStageDraggable) return;

        const x = ev.clientX;
        const walkX = (x - pos.x) * 1.5;
        let prevLeft = htmlEl.scrollLeft;
        htmlEl.scrollLeft = pos.left - walkX;
        vel.x = htmlEl.scrollLeft - prevLeft;

        const y = ev.clientY;
        const walkY = (y - pos.y) * 1.5;
        let prevTop = htmlEl.scrollTop;
        htmlEl.scrollTop = pos.top - walkY;
        vel.y = htmlEl.scrollTop - prevTop;
    });

    htmlEl.addEventListener('mouseup', (ev) => {
        if (isCtrl && ev.button == 0) {
            isStageDraggable = false;
            beginTracking();
        }
    });

    htmlEl.addEventListener('mouseleave', () => {
        isStageDraggable = false;
    });
}