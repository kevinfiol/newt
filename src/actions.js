import { store } from './store';

export const addBox = () => {
    store.update({ boxes: x => [...x, 1] });
};
