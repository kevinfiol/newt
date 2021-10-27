import { update } from './store';

export const incrementId = () => {
    // @ts-ignore
    update({ id: x => x + 1 });
};

export const addBox = () => {
    const el = { content: 'foo' };

    update(state => {
        console.log(state);
        return { boxes: [...state.boxes, el] };
    });
};
