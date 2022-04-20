import { generateId } from './util';
import { setConfig } from './storage';

const MIN_DIMENSION = 200;
const DEFAULT_OPTIONS = {
    color: '#000000',
    bgColor: '#ffffff',
    fontFamily: 'monospace',
    customCss: ''
};


export const state = {
    autohideMenu: false,
    showOptions: false,
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
    files: {}
};

export const resetToDefaults = () => {
    state.autohideMenu = false;
    state.editMode = true;
    state.options = { ...DEFAULT_OPTIONS };
    state.editing = {};
    state.boxes = [];
    state.boxMap = {};
    state.files = {};
};

export const setEditMode = (editMode) => {
    state.editMode = editMode;
    if (!editMode) state.editing = {};
};

export const setAutohideMenu = (autohideMenu) => {
    state.autohideMenu = autohideMenu;
};

export const saveToStorage = () => {
    setConfig({
        editMode: state.editMode,
        boxMap: state.boxMap,
        options: state.options,
        files: state.files
    });
};

export const setShowOptions = (showOptions) => {
    state.showOptions = showOptions;
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
    state.editMode = obj.editMode || false;
    state.options = obj.options || { ...DEFAULT_OPTIONS };

    if (obj.boxMap && Object.keys(obj.boxMap).length > 0) {
        state.boxMap = obj.boxMap;
        state.boxes = Object.values(state.boxMap);
    }
};