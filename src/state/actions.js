export const AddBox = (state) => ({
    ...state,
    boxes: [...state.boxes, 1]
});