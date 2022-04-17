import m from 'mithril';
import { setShowOptions } from '../state';

export const Controls = () => ({
    view: () =>
        m('div.controls',
            m('button.button', { onclick: () => setShowOptions(true) }, 'Options')
        )
});