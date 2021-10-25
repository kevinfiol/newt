import merge from 'mergerino';
import { useReducer } from 'preact/hooks';

/**
 * @typedef {(partial: Record<string, any>) => void | null} Updater
 * 
 * @typedef {object} State
 * @property {number[]} boxes
 */

/** @type {State} **/
const initialState = {
    boxes: []
};

/** @type {Updater} **/
export let update = null;

/** @returns {[State, Updater]} **/
export const useStore = () => {
    const [state, dispatch] = useReducer(merge, initialState);
    if (!update) update = dispatch;
    return [state, update];
}