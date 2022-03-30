import m from 'mithril';
import Movable from '../lib/Movable';
import { updateBox } from '../state';

export const Box = ({ attrs: { config } }) => {
    let box;

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
            box.destroy();
            box = undefined;
        },

        view: ({ attrs: { config: { id, content } } }) =>
            m('div.box', `${id} - ${content}`)
    };
};
