import m from 'mithril';
import { setShowOptions, setEditMode, saveToStorage } from '../state';

export const Controls = () => ({
    view: ({ attrs: { editMode } }) =>
        m('div.controls',
            m('button.button', {
                onclick: () => setShowOptions(true)
            }, 'Options'),

            m('button.button', {
                onclick: () => {
                    setEditMode(!editMode);
                    saveToStorage();
                }
            }, editMode ? 'View Mode' : 'Edit Mode')
        )
});