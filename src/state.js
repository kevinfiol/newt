import m from 'mithril';
import merge from 'mergerino';
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

export let state = {
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
    files: {},
    scroll: {
        x: 0,
        y: 0,
        lock: true
    }
};

export const actions = {
    setState: (patch) => {
        state = merge(state, patch);
    },

    resetToDefaults: () => {
        actions.loadFromObject(defaults);
    },

    setEditMode: (editMode) => {
        state.editMode = editMode;
        if (!editMode) state.editing = {};
    },

    setScroll: (scroll) => {
        actions.setState({ scroll });
        effect.setHtmlOverflow(state.scroll.lock);
        actions.saveToStorage();
    },

    setShowOptions: (showOptions) => {
        actions.setState({ showOptions });
        effect.setHtmlOverflow(showOptions || state.scroll.lock);
    },

    setBoxContent: (boxId, content) => {
        state.boxMap[boxId].content = content;
        state.boxes = Object.values(state.boxMap);
        actions.saveToStorage();
    },

    setLocalFile: (id, file) => {
        state.files[id] = file;
    },

    removeLocalFile: (id) => {
        delete state.files[id];
    },

    clearCtxMenu: () => {
        actions.setState({ ctxMenu: { mode: '', props: null } });
    },

    saveToStorage: async () => {
        await storage.setConfig({
            autohideMenu: state.autohideMenu,
            editMode: state.editMode,
            boxMap: state.boxMap,
            options: state.options,
            files: state.files,
            scroll: state.scroll
        });

        m.redraw();
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
        state.boxes.push(box);
        actions.saveToStorage();
    },

    removeBox: (id) => {
        delete state.boxMap[id];
        state.boxes = state.boxes.filter((box) => box.id !== id);
        actions.saveToStorage();
    },

    toggleEdit: (boxId) => {
        if (state.editing[boxId]) delete state.editing[boxId];
        else state.editing[boxId] = true;
    },

    updateBox: (id, config) => {
        if (!state.boxMap[id]) return;
        state.boxMap[id] = { ...state.boxMap[id], ...config };
        actions.saveToStorage();
    },

    loadFromObject: (obj) => {
        actions.setState({
            autohideMenu: obj.autohideMenu || false,
            editMode: obj.editMode || false,
            options: obj.options || { ...DEFAULT_OPTIONS },
            scroll: obj.scroll || { x: 0, y: 0 }
        });

        if (obj.boxMap && Object.keys(obj.boxMap).length > 0) {
            actions.setState({
                boxMap: obj.boxMap,
                boxes: Object.values(obj.boxMap)
            });
        }

        effect.setStyles(state.options.customCss);
        effect.setScrollbarColor(state.options.bgColor);
        effect.setWindowScroll(state.scroll);
        m.redraw();
    }
};