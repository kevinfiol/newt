import { update } from './store';

export const incrementId = () => {
    // @ts-ignore
    update({ id: x => x + 1 });
};

export const addBox = () => {
    const el = { content: 'foo' };

    update(state => {
        el.id = state.id;
        return {
            id: state.id + 1,
            boxes: [...state.boxes, el]
        };
    });
};
