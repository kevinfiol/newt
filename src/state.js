import hexoid from 'hexoid';
import { setConfig } from './storage';

const MIN_DIMENSION = 100;
const generateId = hexoid();

export const state = {
    editing: {},
    ctxMenu: {
        mode: '',
        props: null,
        x: -999,
        y: -999
    },
    boxes: [],
    boxMap: {}
};

export const saveToStorage = () => {
    setConfig(state.boxMap);
};

export const setBoxMap = (boxMap) => {
    state.boxMap = boxMap;
};

export const setBoxes = (boxes) => {
    state.boxes = boxes;
};

export const setCtxMenu = (ctxMenu) => {
    state.ctxMenu = ctxMenu;
};

export const clearCtxMenu = () => {
    setCtxMenu({ mode: '', props: null, x: -999, y: -999 });
};

export const addBox = (x, y) => {
    const box = {
        id: generateId(),
        x: x || 0,
        y: y || 0,
        width: MIN_DIMENSION,
        height: MIN_DIMENSION,
        content: '# test'
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
    saveToStorage();
};

export const updateBox = (id, config) => {
    if (!state.boxMap[id]) return;
    state.boxMap[id] = { ...state.boxMap[id], ...config };
    saveToStorage();
};