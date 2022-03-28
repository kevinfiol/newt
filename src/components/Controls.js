import m from 'mithril';
import { addBox } from '../state';

export const Controls = () => ({
    view: () =>
        m('div.controls',
            m('button', { onclick: addBox }, 'Add Box')
        )
});