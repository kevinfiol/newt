import m from 'mithril';
import Movable from '../lib/Movable';
import { updateBox, setCtxMenu } from '../state';

export const Box = ({ attrs: { config } }) => {
    let box;

    const onRightClick = (ev) => {
        ev.preventDefault();

        const { clientX, clientY } = ev;

        setCtxMenu({
            mode: 'box',
            config: { id: config.id },
            x: clientX + 2,
            y: clientY + 2
        });

        m.redraw();
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

        view: ({ attrs: { config: { id, content } } }) =>
            m('div.box', { oncontextmenu: onRightClick }, `${id} - ${content}`)
    };
};
