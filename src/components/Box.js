import m from 'mithril';
import cls from 'classies';
import { renderMarkdown } from '../util';
import { Editor } from './Editor';
import Movable from '../lib/Movable';
import { updateBox, setBoxContent, setCtxMenu, toggleEdit } from '../state';
import * as effect from '../effects';

let isCtrl = false;

effect.registerListeners({
    keydown: (ev) => {
        if (ev.key == 'Control') {
            isCtrl = true;
            m.redraw();
        }
    },

    keyup: (ev) => {
        if (ev.key == 'Control') {
            isCtrl = false;
            m.redraw();
        }
    }
});

export const Box = ({ attrs: { config } }) => {
    let box;
    let temp = '';
    let expanded = false;

    const onContextMenu = (ev, editMode, isEditing) => {
        if (!editMode) return;
        ev.stopPropagation();

        if (!isEditing) {
            ev.preventDefault();

            setCtxMenu({
                mode: 'box',
                x: ev.pageX + 1,
                y: ev.pageY + 1,
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

        view: ({ attrs: { config: { id, content }, editMode, isEditing } }) =>
            m('div.box', {
                className: cls({
                    'unmovable unresizable': isEditing || !editMode || isCtrl,
                    'movable': editMode && !isEditing,
                    '-editing': isEditing,
                    '-expanded': expanded,
                }),
                oncontextmenu: (ev) => onContextMenu(ev, editMode, isEditing)
            },
                !isEditing &&
                    m('div.content',
                        m.trust(renderMarkdown(content))
                    )
                ,

                isEditing && [
                    m(Editor, {
                        editorContent: content,
                        syntax: 'markdown',
                        onInput: (val) => temp = val
                    }),

                    m('div.controls',
                        m('button.button', {
                            onclick: () => expanded = !expanded
                        }, expanded ? 'Collapse' : 'Expand'),

                        m('button.button.save-btn', { onclick: () => {
                            if (temp) {
                                setBoxContent(id, temp);
                                temp = '';
                            }

                            toggleEdit(id);
                            expanded = false;
                            m.redraw();
                        } }, 'Save')
                    )
                ],
            )
    };
};
