import m from 'mithril';
import { setCtxMenu } from './state';

export const contextMenu = (ev, config) => {
    ev.preventDefault();
    const { clientX, clientY } = ev;
    setCtxMenu({ ...config, x: clientX, y: clientY });
    m.redraw();
};