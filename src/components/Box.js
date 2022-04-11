import m from 'mithril';
import Movable from '../lib/Movable';
import { updateBox } from '../state';
import { contextMenu } from '../effects';

export const Box = ({ attrs: { config } }) => {
    let box;

    const onContextMenu = (ev) => {
        ev.stopPropagation();
        contextMenu(ev, {
            mode: 'box',
            config: { id: config.id },
        });
    };

    return {
        oncreate: ({ dom }) => {
            const { id, x, y, width, height } = config;

            box = new Movable(dom, {
                x,
                y,
                width,
                height,
                onChange: ({ position, size }) => {
                    updateBox(id, {
                        x: position.x,
                        y: position.y,
                        width: size.width,
                        height: size.height
                    });
                }
            });
        },

        onremove: () => {
            console.log('destroy');
            box.destroy();
            box = undefined;
        },

        view: ({ attrs: { config: { content } } }) =>
            m('div.box', { oncontextmenu: onContextMenu }, content)
    };
};
