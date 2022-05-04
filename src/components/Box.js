import m from 'mithril';
import cls from 'classies';
import { renderMarkdown } from '../util';
import { Editor } from './Editor';
import Movable from '../lib/Movable';
import { updateBox, setBoxContent, setCtxMenu, toggleEdit } from '../state';

// const SCROLL_DISTANCE = 20;
// const htmlEl = document.querySelector('html');
let isCtrl = false;

document.addEventListener('keydown', (ev) => {
    if (ev.key == 'Control') {
        isCtrl = true;
        m.redraw();
    }
});

document.addEventListener('keyup', (ev) => {
    if (ev.key == 'Control') {
        isCtrl = false;
        m.redraw();
    }
});

export const Box = ({ attrs: { config } }) => {
    let domRef;
    let box;
    let temp = '';
    let expanded = false;
    // let scrollInterval = null;

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

    // buggy, needs fixing
    // const scrollWhileMoving = () => {
    //     let left = box.position.x;
    //     let right = left + box.size.width - window.scrollX;
    //     let top = box.position.y;
    //     let bottom = top + box.size.height - window.scrollY;

    //     if (right > window.innerWidth - 100) {
    //         htmlEl.scrollLeft += SCROLL_DISTANCE;
    //     } else if (left < window.scrollX) {
    //         htmlEl.scrollLeft -= SCROLL_DISTANCE;
    //     }

    //     if (bottom > window.innerHeight) {
    //         htmlEl.scrollTop += SCROLL_DISTANCE;
    //     } else if (top < window.scrollY) {
    //         htmlEl.scrollTop -= SCROLL_DISTANCE;
    //     }
    // };

    // const watchForScrolling = () => {
    //     scrollInterval = setInterval(scrollWhileMoving, 100);
    // };

    // const stopWatchForScrolling = () => {
    //     clearInterval(scrollInterval);
    // };

    return {
        oncreate: ({ dom }) => {
            domRef = dom;
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
            domRef = undefined;
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
                // onmousedown: () => {
                //     if (editMode && !isEditing) watchForScrolling();
                // },
                // onmouseup: () => {
                //     if (editMode && !isEditing) stopWatchForScrolling();
                // },
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
