import m from 'mithril';
import Movable from '../lib/Movable';

export const Box = () => {
    let box;

    return {
        oncreate: ({ dom }) => {
            box = new Movable(dom, {
                x: 100,
                y: 100,
                onChange: console.log
            });
        },

        onremove: () => {
            box.destroy();
            box = undefined;
        },

        view: ({ attrs: { id, content } }) =>
            m('div.box', `${id} - ${content}`)
    };
};
