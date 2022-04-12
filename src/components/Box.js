import m from 'mithril';
import { marked } from 'marked';
import { Editor } from './Editor';
import Movable from '../lib/Movable';
import { updateBox, setBoxContent } from '../state';
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
            box.destroy();
            box = undefined;
        },

        view: ({ attrs: { config: { id, content }, isEditing } }) =>
            m('div.box', {
                className: isEditing ? 'unmovable unresizable' : '',
                oncontextmenu: onContextMenu
            },
                !isEditing &&
                    m.trust( marked(content) )
                ,

                isEditing &&
                    m(Editor, {
                        editorContent: content,
                        syntax: 'markdown',
                        onInput: (val) => setBoxContent(id, val)
                    })
                ,
            )
    };
};
