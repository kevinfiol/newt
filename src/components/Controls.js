import m from 'mithril';
import { setShowOptions, setShowAbout, setEditMode, saveToStorage } from '../state';

export const Controls = () => ({
    view: ({ attrs: { autohideMenu, editMode } }) =>
        m('div.controls', { className: autohideMenu ? 'autohide' : '' },
            m('button.button', {
                onclick: () => setShowOptions(true)
            }, 'Options'),

            m('button.button', {
                onclick: () => {
                    setEditMode(!editMode);
                    saveToStorage();
                }
            }, editMode ? 'View Mode' : 'Edit Mode'),

            m('button.button', {
                onclick: () => setShowAbout(true)
            }, ' ? ')
        )
});