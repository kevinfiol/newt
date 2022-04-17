import m from 'mithril';
import { marked } from 'marked';
import { Editor } from './Editor';
import Movable from '../lib/Movable';
import { updateBox, setBoxContent, setCtxMenu, toggleEdit } from '../state';

export const Box = ({ attrs: { config } }) => {
    let box;
    let temp = '';

    const onContextMenu = (ev, isEditing) => {
        ev.stopPropagation();

        if (!isEditing) {
            ev.preventDefault();

            setCtxMenu({
                mode: 'box',
                x: ev.clientX + 1,
                y: ev.clientY + 1,
                props: { id: config.id },
            });
        }
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
                oncontextmenu: (ev) => onContextMenu(ev, isEditing)
            },
                !isEditing &&
                    m.trust(marked(content))
                ,

                isEditing && [
                    m(Editor, {
                        editorContent: content,
                        syntax: 'markdown',
                        onInput: (val) => temp = val
                    }),

                    m('button.button.save-btn', { onclick: () => {
                        if (temp) {
                            console.log({temp});
                            setBoxContent(id, temp);
                            temp = '';
                        }

                        toggleEdit(id);
                        m.redraw();
                    } }, 'save')
                ],
            )
    };
};
