import { update } from './store';

export const addBox = () => {
    update({ boxes: x => [...x, 1] });
};
