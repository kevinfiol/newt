import hexoid from 'hexoid';
import { setConfig } from './storage';

const MIN_DIMENSION = 100;
const generateId = hexoid();

export const state = {
    ctxMenu: {
        mode: '',
        config: null,
        x: -999,
        y: -999
    },
    boxes: [],
    boxMap: {}
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

export const addBox = (x, y) => {
    const box = {
        id: generateId(),
        x: x || 0,
        y: y || 0,
        width: MIN_DIMENSION,
        height: MIN_DIMENSION,
        content: ''
    };

    state.boxMap[box.id] = box;
    state.boxes.push(box);
    setConfig(state.boxMap);
};

export const removeBox = (id) => {
    delete state.boxMap[id];
    state.boxes = state.boxes.filter((box) => box.id !== id);
    setConfig(state.boxMap);
};

export const updateBox = (id, config) => {
    if (!state.boxMap[id]) return;
    state.boxMap[id] = { ...state.boxMap[id], ...config };
    setConfig(state.boxMap);
};