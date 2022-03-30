import { setConfig } from "./storage";

const MIN_DIMENSION = 100;

export const state = {
    id: 0,
    boxes: [],
    boxMap: {}
};

export const addBox = () => {
    const box = {
        id: state.id,
        x: 0,
        y: 0,
        width: MIN_DIMENSION,
        height: MIN_DIMENSION,
        content: ''
    };

    state.boxMap[state.id] = box;
    state.boxes.push(box);
    state.id += 1;
    setConfig(state.boxMap);
};

export const updateBox = (id, config) => {
    if (!state.boxMap[id]) return;
    state.boxMap[id] = { ...state.boxMap[id], ...config };
    setConfig(state.boxMap);
};

export const setBoxMap = (boxMap) => {
    state.boxMap = boxMap;
};

export const setBoxes = (boxes) => {
    state.boxes = boxes;
};