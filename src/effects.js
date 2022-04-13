import m from 'mithril';
import { setCtxMenu } from './state';

export const openContextMenu = (x, y, config) => {
    setCtxMenu({ ...config, x: clientX, y: clientY });
    m.redraw();
};