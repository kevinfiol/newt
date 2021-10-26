import { update } from './store';

export const addBox = () => {
    const el = { content: 'foo' };
    update({ boxes: x => [...x, el] });
};
