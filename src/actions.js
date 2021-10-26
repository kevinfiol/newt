import { update } from './store';

export const incrementId = () => {
    update(state => {
        console.log(state.id);
        return { id: state.id + 1 };
    });

    // update({ id: x => x + 1 });
};

export const addBox = () => {
    // const el = { content: 'foo' };
    // update({ boxes: x => [...x, el] });
    update(state => {
        console.log(state);
        return { boxes: [...state.boxes, 1] };
    });
};
