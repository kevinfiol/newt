import merge from 'mergerino';
import { useState } from 'preact/hooks';

/**
 * @typedef {object} State
 * @property {number} id
 * @property {Record<string, any>[]} boxes
 * 
 * @typedef {Partial<State>} ObjectPatch
 * @typedef {(S: State) => ObjectPatch} FunctionPatch
 * @typedef {(patch: ObjectPatch | FunctionPatch) => void | null} Updater
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
                typeof patch == 'function'
                    ? patch(prevState)
                    : patch
            )
        )
    }

    return [state, update];
}