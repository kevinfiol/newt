import merge from 'mergerino';

// initial state
const initialState = {
    boxes: []
};

export const store = {
    update: null,
    reducer: merge,
    init: () => initialState,
    listen: dispatch => store.update = dispatch
};
