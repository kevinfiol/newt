import m from 'mithril';
import { setShowOptions, setEditMode } from '../state';

export const Controls = () => ({
    view: ({ attrs: { editMode } }) =>
        m('div.controls',
            m('button.button', { onclick: () => setShowOptions(true) }, 'Options'),
            m('button.button', { onclick: () => setEditMode(!editMode) }, editMode ? 'Normal Mode' : 'Edit Mode')
        )
});