import merge from 'mergerino';
import { useReducer, useState } from 'preact/hooks';

/**
 * @typedef {(partial: Record<string, any>) => void | null} Updater
 * 
 * @typedef {object} State
 * @property {number} id
 * @property {Record<string, any>[]} boxes
 */

/** @type {State} **/
const initialState = {
    id: 1,
    boxes: []
};

/** @type {Updater} **/
export let update = null;

/** @returns {[State, Updater]} **/
export const useStore = () => {
    const [state, setState] = useState(initialState);

    if (!update) {
        update = (patch) => setState(prevState =>
            merge(
                prevState,
                patch == 'function'
                    ? patch(prevState)
                    : patch
            )
        )
    }

    return [state, update];
}