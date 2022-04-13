import m from 'mithril';
import { state, setBoxMap, setBoxes, setCtxMenu, clearCtxMenu } from './state';
// import { contextMenu } from './effects';
import { getConfig, setConfig } from './storage';
import { ContextMenu } from './components/ContextMenu';
import { Box } from './components/Box';
import { Modal } from './components/Modal';

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
        m('div.container',
            m(ContextMenu, { ctxMenu: state.ctxMenu }),

            m('div.stage', {
                onmousedown: (ev) => {
                    if (ev.button === 0 && state.ctxMenu.mode) {
                        clearCtxMenu();
                    }
                },

                oncontextmenu: (ev) => {
                    ev.preventDefault();

                    setCtxMenu({
                        mode: 'container',
                        x: ev.clientX,
                        y: ev.clientY
                    });
                }
            },
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