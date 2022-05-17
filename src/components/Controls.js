import m from 'mithril';
import { actions } from '../store';

export const Controls = () => ({
    view: ({ attrs: { autohideMenu, editMode, scrollLock } }) =>
        m('div.controls', { className: autohideMenu ? 'autohide' : '' },
            m('button.button', {
                onclick: () => actions.setShowOptions(true)
            }, 'Options'),

            m('button.button', {
                onclick: () => {
                    actions.setEditMode(!editMode);
                    actions.saveToStorage();
                }
            }, editMode ? 'View Mode' : 'Edit Mode'),

            m('button.button', {
                onclick: () => actions.setScroll({ lock: !scrollLock })
            }, scrollLock ? 'Unlock' : 'Lock'),

            m('button.button', {
                onclick: () => actions.setState({ showAbout: true })
            }, ' ? ')
        )
});