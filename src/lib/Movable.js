const DEFAULT_CELL_SIZE = 25;
const DEFAULT_MIN_DIMENSION = DEFAULT_CELL_SIZE * 4;

/**
 * @typedef {object} Config
 * @property {number} cellSize
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {(...any) => any} onChange
 */

class Movable {
    /**
     * @param {HTMLElement} el 
     * @param {Partial<Config>} config
     */
    constructor(el, config = {}) {
        config = {
            cellSize: DEFAULT_CELL_SIZE,
            x: 0,
            y: 0,
            width: DEFAULT_MIN_DIMENSION,
            height: DEFAULT_MIN_DIMENSION,
            onChange: null,
            ...config
        };

        this.el = el;
        this.cellSize = config.cellSize;
        this.minDimension = config.cellSize * 4;
        this.isResizing = false;
        this.hasChangeOccurred = false;
        this.onChange = config.onChange;

        /** @type {{ x: number, y: number }} **/
        this.position = { x: config.x, y: config.y };
        this.size = { width: config.width, height: config.height };

        /**
         * @type Record<string, (ev: MouseEvent) => void>
         */
        this.events = {};

        /**
         * @type {{ x: number, y: number }}
         */
        this.offset = { x: null, y: null };
        this.init();
    }

    init() {
        const mousedown = this.mousedown.bind(this);
        this.el.addEventListener('mousedown', mousedown);
        this.events.mousedown = mousedown;
        this.createResizeHandles(this.el);

        // update DOM based on initial position
        this.setPosition(this.position.x, this.position.y);

        // update height/width based on initial size
        this.el.style.width = this.size.width + 'px';
        this.el.style.height = this.size.height + 'px';
    }

    destroy() {
        document.removeEventListener('mousedown', this.events.mousedown);
        document.removeEventListener('mousemove', this.events.mousemove);
        document.removeEventListener('mouseup', this.events.mouseup);
        this.events = {};
    }

    /**
     * @param {HTMLElement} el 
     */
    createResizeHandles(el) {
        const eHandle = document.createElement('div');
        eHandle.classList.add('handle', 'handle--e');

        const sHandle = document.createElement('div');
        sHandle.classList.add('handle', 'handle--s');

        const seHandle = document.createElement('div');
        seHandle.classList.add('handle', 'handle--se');

        el.appendChild(eHandle);
        el.appendChild(sHandle);
        el.appendChild(seHandle);

        let mousemove;
        let mouseup;

        /**
         * @param {number} initX
         * @param {number} initY
         * @param {number} initWidth
         * @param {number} initHeight
         * @param {string} axis
         * 
         * @returns {(ev: MouseEvent) => void} mousemove
         */
        const makeMousemove = (initX, initY, initWidth, initHeight, axis) => {
            /**
             * @param {MouseEvent} ev
             */
            mousemove = ev => {
                let width = initWidth + (ev.clientX - initX);
                let height = initHeight + (ev.clientY - initY);

                /** @type {HTMLElement} **/
                const parentNode = (this.el.parentNode);
                let maxX = parentNode.offsetWidth;
                let maxY = parentNode.offsetHeight;

                // width adjustments
                if (axis == 'xy' || axis == 'x') {
                    width = Math.min(Math.max(width, this.minDimension), maxX);
                    width = Math.round(width / this.cellSize) * this.cellSize;

                    this.size.width = width;
                    el.style.width = width + 'px';
                }

                // height adjustments
                if (axis == 'xy' || axis == 'y') {
                    height = Math.min(Math.max(height, this.minDimension), maxY);
                    height = Math.round(height / this.cellSize) * this.cellSize;

                    this.size.height = height;
                    el.style.height = height + 'px';
                }
            };

            return mousemove;
        };

        mouseup = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);

            if (this.onChange) {
                this.onChange({ position: this.position, size: this.size });
            }
        };

        for (let handle of [eHandle, sHandle, seHandle]) {
            let axis = 'xy';
            if (handle == eHandle) axis = 'x';
            else if (handle == sHandle) axis = 'y';

            handle.addEventListener('mousedown', ev => {
                this.isResizing = true;
                let initX = ev.clientX;
                let initY = ev.clientY;
                let initWidth = el.clientWidth;
                let initHeight = el.clientHeight;

                document.addEventListener('mouseup', mouseup);
                document.addEventListener('mousemove',
                    makeMousemove(initX, initY, initWidth, initHeight, axis)
                );
            });
        }
    }

    /**
     * @param {MouseEvent} ev
     */
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

    /**
     * @param {MouseEvent} ev
     */
    mousemove(ev) {
        // don't move is user is resizing
        if (this.isResizing) return;

        let oldX = this.position.x;
        let oldY = this.position.y;

        const newPos = this.setPosition(
            ev.clientX - this.offset.x,
            ev.clientY - this.offset.y
        );

        if (oldX !== newPos.x || oldY !== newPos.y) {
            this.hasChangeOccurred = true;
        }
    }

    mouseup() {
        this.el.classList.remove('grabbing');
        document.removeEventListener('mousemove', this.events.mousemove);
        document.removeEventListener('mouseup', this.events.mouseup);

        if (this.onChange && this.hasChangeOccurred) {
            this.hasChangeOccurred = false;
            this.onChange({ position: this.position, size: this.size });
        }
    }

    clamp(x = this.position.x, y = this.position.y, minX = 0, minY = 0) {
        /** @type {HTMLElement} **/
        const parentNode = (this.el.parentNode);
        let maxX = parentNode.offsetWidth - this.el.offsetWidth;
        let maxY = parentNode.offsetHeight - this.el.offsetHeight;

        x = Math.min(Math.max(x, minX), maxX);
        y = Math.min(Math.max(y, minY), maxY);

        // align to grid
        x = Math.round(x / this.cellSize) * this.cellSize;
        y = Math.round(y / this.cellSize) * this.cellSize;

        return { x, y };
    }

    setPosition(x = this.position.x, y = this.position.y) {
        const clamped = this.clamp(x, y);
        x = clamped.x;
        y = clamped.y;

        this.position.x = x;
        this.position.y = y;

        this.el.style.left = x + 'px';
        this.el.style.top = y + 'px';

        return { x, y };
    }
}

export default Movable;