import m from 'mithril';
import { generateId } from './util';
import { storage } from './storage';
import { defaults } from './defaults';
import * as effect from './effects';

const MIN_DIMENSION = 200;

const DEFAULT_OPTIONS = {
    color: '#2a2a2a',
    bgColor: '#dadada',
    fontFamily: 'monospace',
    customCss: ''
};

export const state = {
    isLoaded: false,
    autohideMenu: false,
    showOptions: false,
    showAbout: false,
    editMode: true,
    options: { ...DEFAULT_OPTIONS },
    editing: {},
    ctxMenu: {
        mode: '',
        props: null,
        x: -999,
        y: -999
    },
    boxes: [],
    boxMap: {},
    boxStackOrder: [],
    files: {},
    scroll: {
        x: 0,
        y: 0,
        lock: true
    }
};

export const actions = ($ = {
    setState: (obj) => {
        for (let k in obj) {
            state[k] = obj[k];
        }
    },

    setAutohideMenu: (autohideMenu) => {
        state.autohideMenu = autohideMenu;
    },

    setEditMode: (editMode) => {
        state.editMode = editMode;
        if (!editMode) state.editing = {};
    },

    setShowAbout: (showAbout) => {
        state.showAbout = showAbout;
    },

    setScroll: (scroll) => {
        for (let k in scroll) {
            state.scroll[k] = scroll[k];
        }

        $.saveToStorage();
        effect.setHtmlOverflow(scroll.lock);
    },

    setShowOptions: (showOptions) => {
        state.showOptions = showOptions;
        effect.setHtmlOverflow(showOptions || state.scroll.lock);
    },

    setBoxContent: (boxId, content) => {
        state.boxMap[boxId].content = content;
        state.boxes = Object.values(state.boxMap);
        $.saveToStorage();
    },

    setLocalFile: (id, file) => {
        state.files[id] = file;
    },

    removeLocalFile: (id) => {
        delete state.files[id];
    },

    setOptions: (options) => {
        for (let k in options) {
            state.options[k] = options[k];
        }
    },

    setCtxMenu: (ctxMenu) => {
        for (let k in ctxMenu) {
            state.ctxMenu[k] = ctxMenu[k];
        }
    },

    clearCtxMenu: () => {
        state.ctxMenu.mode = '';
        state.ctxMenu.props = null
    },

    saveToStorage: () => {
        return storage.setConfig({
            autohideMenu: state.autohideMenu,
            editMode: state.editMode,
            boxMap: state.boxMap,
            boxStackOrder: state.boxStackOrder,
            options: state.options,
            files: state.files,
            scroll: state.scroll
        })
    },

    moveBoxToTop: (id) => {
        state.boxStackOrder = state.boxStackOrder.filter(x => x !== id);
        state.boxStackOrder.push(id);
        $.saveToStorage();
    },

    addBox: (x, y) => {
        const box = {
            id: generateId(),
            x: x || 0,
            y: y || 0,
            width: MIN_DIMENSION,
            height: MIN_DIMENSION,
            content: 'Right-Click to Edit...'
        };

        state.boxMap[box.id] = box;
        state.boxes = [...state.boxes, box];
        state.boxStackOrder = [...state.boxStackOrder, box.id];

        $.saveToStorage();
    },

    removeBox: (id) => {
        delete state.boxMap[id];
        state.boxes = state.boxes.filter((box) => box.id !== id);
        state.boxStackOrder = state.boxStackOrder.filter((x) => x !== id);

        $.saveToStorage();
    },

    toggleEdit: (boxId) => {
        state.editing[boxId] = !state.editing[boxId];
    },

    updateBox: (id, config) => {
        if (!state.boxMap[id]) return;
        state.boxMap[id] = { ...state.boxMap[id], ...config };

        $.saveToStorage();
    },

    resetToDefaults: () => {
        $.loadFromObject(defaults);
    },

    loadFromObject: (obj) => {
        state.showOptions = false,
        state.autohideMenu = obj.autohideMenu || false,
        state.editMode = obj.editMode || false,
        state.options = obj.options || { ...DEFAULT_OPTIONS },
        state.scroll = obj.scroll || { x: 0, y: 0 }

        const isNewBoxes = obj.boxMap && Object.keys(obj.boxMap).length > 0;

        if (isNewBoxes) {
            state.boxMap = {};
            state.boxes = [];
            state.boxStackOrder = [];
        }

        // apply effects
        effect.setStyles(state.options.customCss);
        effect.setScrollbarColor(state.options.bgColor);
        effect.setWindowScroll(state.scroll);
        $.saveToStorage().finally(m.redraw);

        setTimeout(() => {
            state.boxMap = obj.boxMap;

            if (isNewBoxes) {
                state.boxes = Object.values(obj.boxMap);
                state.boxStackOrder = obj.boxStackOrder || Object.keys(obj.boxMap);
            }

            $.saveToStorage().then(m.redraw);
        });
    }
});