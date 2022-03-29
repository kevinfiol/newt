export const state = {
    id: 0,
    boxes: []
};

export const addBox = () => {
    const box = { id: state.id, content: 'foo' };
    console.log(box);

    state.id += 1;
    state.boxes = [...state.boxes, box];
};