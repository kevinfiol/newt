import m from 'mithril';
import cls from 'classies';
import { renderMarkdown } from '../util';
import { Editor } from './Editor';
import Movable from '../lib/Movable';
import { actions } from '../store';
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

export const Box = ({ attrs }) => {
    let box;
    let temp = '';
    let expanded = false;

    const setCtxMenu = (patch) => actions.setState({ ctxMenu: patch });

    const onContextMenu = (ev, editMode, isEditing) => {
        if (!editMode) return;
        ev.stopPropagation();

        if (!isEditing) {
            ev.preventDefault();

            setCtxMenu({
                mode: 'box',
                x: ev.pageX + 1,
                y: ev.pageY + 1,
                props: { id: attrs.config.id },
            });
        }
    };

    return {
        oncreate: ({ dom, attrs: { config } }) => {
            const { id, x, y, width, height } = config;

            box = new Movable(dom, {
                x,
                y,
                width,
                height,
                onChange: ({ position, size }) => {
                    actions.updateBox(id, {
                        x: position.x,
                        y: position.y,
                        width: size.width,
                        height: size.height
                    });
                },
                onGrab: () => {
                    actions.moveBoxToTop(id);
                }
            });
        },

        onremove: () => {
            box.destroy();
            box = undefined;
        },

        view: ({ attrs: { config: { id, content }, zIndex, editMode, isEditing } }) =>
            m('div.box', {
                style: { zIndex: zIndex || '1' },
                className: cls({
                    [id]: true,
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
                                actions.setBoxContent(id, temp);
                                temp = '';
                            }

                            actions.toggleEdit(id);
                            expanded = false;
                            m.redraw();
                        } }, 'Save')
                    )
                ],
            )
    };
};
