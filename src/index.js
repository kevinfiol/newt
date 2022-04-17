import m from 'mithril';
import { state, setBoxMap, setBoxes, setCtxMenu, clearCtxMenu, setShowOptions, setOptions } from './state';
// import { contextMenu } from './effects';
import { getConfig, setConfig } from './storage';
import { ContextMenu } from './components/ContextMenu';
import { Box } from './components/Box';
import { Modal } from './components/Modal';
import { Options } from './components/Options';

const App = () => ({
    oninit: () => {
        const config = getConfig();

        if (!config) {
            setConfig({ boxMap: state.boxMap, options: state.options });
        } else {
            const { boxMap, options } = config;
            setBoxMap(boxMap);
            setOptions(options);
        }

        setBoxes(Object.values(state.boxMap));
        document.getElementById('newt-styles').innerText = state.options.customCss;
    },

    view: () =>
        m('div.container',
            state.showOptions &&
                m(Modal, { closeAction: () => setShowOptions(false) },
                    m(Options, { options: state.options })
                )
            ,

            m(ContextMenu, { ctxMenu: state.ctxMenu }),

            m('div.stage', {
                style: {
                    color: state.options.color,
                    backgroundColor: state.options.bgColor,
                    fontFamily: state.options.fontFamily
                },

                onmousedown: (ev) => {
                    if (ev.button === 0 && state.ctxMenu.mode) {
                        clearCtxMenu();
                    }
                },

                oncontextmenu: (ev) => {
                    ev.preventDefault();
                    const x = ev.clientX;
                    const y = ev.clientY;

                    setCtxMenu({
                        mode: 'container',
                        x,
                        y,
                        props: { x, y }
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