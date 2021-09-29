const CELL_SIZE = 25;

class Movable {
    constructor(el) {
        this.el = el;
        this.events = {};
        this.offset = { x: null, y: null };
        this.init();
    }

    init() {
        const mousedown = this.mousedown.bind(this);
        this.el.addEventListener('mousedown', mousedown);
        this.events.mousedown = mousedown;
    }

    destroy() {
        document.removeEventListener('mousedown', this.events.mousedown);
        document.removeEventListener('mousemove', this.events.mousemove);
        document.removeEventListener('mouseup', this.events.mouseup);
        this.events = {};
    }

    mousedown(ev) {
        ev.preventDefault();
        if (ev.button != 0) return;

        this.offset.x = ev.clientX - this.el.offsetLeft;
        this.offset.y = ev.clientY - this.el.offsetTop;

        const mousemove = this.mousemove.bind(this);
        const mouseup = this.mouseup.bind(this);

        this.events.mousemove = mousemove;
        this.events.mouseup = mouseup;

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    }

    mousemove(ev) {
        let minX = 0;
        let minY = 0;
        let maxX = this.el.parentNode.offsetWidth - this.el.offsetWidth;
        let maxY = this.el.parentNode.offsetHeight - this.el.offsetHeight;

        let x = ev.clientX - this.offset.x;
        let y = ev.clientY - this.offset.y;

        // clamp
        x = Math.min(Math.max(x, minX), maxX);
        y = Math.min(Math.max(y, minY), maxY);

        x = Math.round(x / CELL_SIZE) * CELL_SIZE;
        y = Math.round(y / CELL_SIZE) * CELL_SIZE;

        this.el.style.left = x + 'px';
        this.el.style.top = y + 'px';
    }

    mouseup() {
        document.removeEventListener('mousemove', this.events.mousemove);
        document.removeEventListener('mouseup', this.events.mouseup);
    }
}

export default Movable;