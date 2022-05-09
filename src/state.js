import m from 'mithril';
import { generateId, getBrightness } from './util';
import { browserStorage } from './storage';
import { defaults } from './defaults';

const MIN_DIMENSION = 200;

export const state = {
    autohideMenu: false,
    showOptions: false,
    showAbout: false,
    editMode: true,
    options: {
        color: '#2a2a2a',
        bgColor: '#dadada',
        fontFamily: 'monospace',
        customCss: ''
    },
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
        y: 0
    }
};

export const resetToDefaults = () => {
    loadFromObject(defaults);
};

export const setShowAbout = (showAbout) => {
    state.showAbout = showAbout;
};

export const setEditMode = (editMode) => {
    state.editMode = editMode;
    if (!editMode) state.editing = {};
};

export const setScroll = (scroll) => {
    state.scroll = { ...state.scroll, ...scroll };
    saveToStorage();
};

export const setAutohideMenu = (autohideMenu) => {
    state.autohideMenu = autohideMenu;
};

export const saveToStorage = async () => {
    await browserStorage.setConfig({
        autohideMenu: state.autohideMenu,
        editMode: state.editMode,
        boxMap: state.boxMap,
        options: state.options,
        files: state.files,
        scroll: state.scroll
    });

    m.redraw();
};

export const setShowOptions = (showOptions) => {
    state.showOptions = showOptions;
    document.querySelector('html').style.overflow = showOptions ? 'hidden' : 'auto';
};

export const setOptions = (options) => {
    state.options = { ...state.options, ...options };
};

export const setBoxMap = (boxMap) => {
    state.boxMap = boxMap;
};

export const setBoxes = (boxes) => {
    state.boxes = boxes;
};

export const setFiles = (files) => {
    state.files = files;
};

export const setCtxMenu = (ctxMenu) => {
    state.ctxMenu = ctxMenu;
};

export const clearCtxMenu = () => {
    setCtxMenu({ mode: '', props: null });
};

export const addBox = (x, y) => {
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
    saveToStorage();
};

export const removeBox = (id) => {
    delete state.boxMap[id];
    state.boxes = state.boxes.filter((box) => box.id !== id);
    saveToStorage();
};

export const toggleEdit = (boxId) => {
    if (state.editing[boxId]) delete state.editing[boxId];
    else state.editing[boxId] = true;
};

export const setBoxContent = (boxId, content) => {
    state.boxMap[boxId].content = content;

    // TODO
    // this is to fix a big where if you resize a box and then try to set content
    // it doesn't properly rerender
    state.boxes = Object.values(state.boxMap);
    saveToStorage();
};

export const updateBox = (id, config) => {
    if (!state.boxMap[id]) return;
    state.boxMap[id] = { ...state.boxMap[id], ...config };
    saveToStorage();
};

export const setLocalFile = (id, file) => {
    state.files[id] = file;
};

export const removeLocalFile = (id) => {
    delete state.files[id];
};

export const loadFromObject = (obj) => {
    state.autohideMenu = obj.autohideMenu || false;
    state.editMode = obj.editMode || false;
    state.options = obj.options || { ...DEFAULT_OPTIONS };
    state.scroll = obj.scroll || { x: 0, y: 0 };

    if (obj.boxMap && Object.keys(obj.boxMap).length > 0) {
        state.boxMap = obj.boxMap;
        state.boxes = Object.values(state.boxMap);
    }

    document.getElementById('newt-styles').innerText = state.options.customCss;
    document.querySelector('html').style.scrollbarColor =
        `${getBrightness(state.options.bgColor) < 120 ? '#404040' : '#999999'} ${state.options.bgColor}`;
    requestAnimationFrame(() => window.scrollTo(state.scroll.x, state.scroll.y));
};