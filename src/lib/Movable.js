const CELL_SIZE = 25;

class Movable {
    constructor(el) {
        this.el = el;
        this.container = null;
        this.events = {};
        this.isResizing = false;
        this.offset = { x: null, y: null };
        this.init();
    }

    init() {
        const mousedown = this.mousedown.bind(this);
        this.el.addEventListener('mousedown', mousedown);
        this.events.mousedown = mousedown;
        this.createResizeHandles(this.el);
    }

    destroy() {
        document.removeEventListener('mousedown', this.events.mousedown);
        document.removeEventListener('mousemove', this.events.mousemove);
        document.removeEventListener('mouseup', this.events.mouseup);
        this.events = {};
    }

    createResizeHandles(el) {
        // const innerHtml = el.innerHTML;
        // el.innerHTML = ''; // clear element

        const eHandle = document.createElement('div');
        eHandle.classList.add('handle', 'handle--e');

        const sHandle = document.createElement('div');
        sHandle.classList.add('handle', 'handle--s');

        const seHandle = document.createElement('div');
        seHandle.classList.add('handle', 'handle--se');

        el.appendChild(eHandle);
        el.appendChild(sHandle);
        el.appendChild(seHandle);
        console.log(el);

        let mousemove;
        let mouseup;

        const makeMousemove = (initX, initY, initWidth, initHeight) => {
            mousemove = ev => {
                let width = initWidth + (ev.clientX - initX);
                let height = initHeight + (ev.clientY - initY);

                width = Math.min(Math.max(width, 50), Infinity);
                height = Math.min(Math.max(height, 50), Infinity);

                width = Math.round(width / CELL_SIZE) * CELL_SIZE;
                height = Math.round(height / CELL_SIZE) * CELL_SIZE;

                el.style.width = width + 'px';
                el.style.height = height + 'px';
            };

            return mousemove;
        };

        mouseup = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        };


        seHandle.addEventListener('mousedown', ev => {
            this.isResizing = true;
            let initX = ev.clientX;
            let initY = ev.clientY;
            let initWidth = el.clientWidth;
            let initHeight = el.clientHeight;

            document.addEventListener('mousemove', makeMousemove(initX, initY, initWidth, initHeight));
            document.addEventListener('mouseup', mouseup);
        });
    }

    mousedown(ev) {
        ev.preventDefault();
        if (ev.button != 0) return;
        this.el.classList.add('grabbing');

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
        // don't move is user is resizing
        if (this.isResizing) return;

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
        this.el.classList.remove('grabbing');
        document.removeEventListener('mousemove', this.events.mousemove);
        document.removeEventListener('mouseup', this.events.mouseup);
    }
}

export default Movable;