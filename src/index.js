import m from 'mithril';
import { state, setBoxMap, setBoxes, setCtxMenu } from './state';
import { contextMenu } from './effects';
import { getConfig, setConfig } from './storage';
import { ContextMenu } from './components/ContextMenu';
import { Box } from './components/Box';

const App = () => ({
    oninit: () => {
        const config = getConfig();
        if (!config) setConfig(state.boxMap);
        else setBoxMap(config);

        const boxes = Object.values(state.boxMap);
        setBoxes(boxes);
        console.log(state);
    },

    view: () =>
        m('div.container', {
            onmousedown: (ev) => {
                if (ev.button === 0 && state.ctxMenu.mode) {
                    setCtxMenu({ x: -999, y: -999, mode: '', config: null });
                }
            },

            oncontextmenu: (ev) => {
                contextMenu(ev, {
                    mode: 'container',
                    config: { x: ev.clientX, y: ev.clientY }
                });
            }
        },
            m(ContextMenu, { ctxMenu: state.ctxMenu }),

            m('div.stage',
                state.boxes.map((box) =>
                    m(Box, {
                        key: box.id,
                        config: box,
                        isEditing: state.editing[box.id]
                    })
                )
            )
        )
});

m.mount(document.getElementById('app'), App);