import m from 'mithril';
import cls from 'classies';
import { state, setBoxMap, setBoxes, setCtxMenu, clearCtxMenu, setShowOptions, setOptions, setEditMode, setFiles, setAutohideMenu, setShowAbout, setScroll } from './state';
import { getBrightness, debounce } from './util';
import { getConfig, setConfig } from './storage';
import { Controls } from './components/Controls';
import { ContextMenu } from './components/ContextMenu';
import { Box } from './components/Box';
import { Modal } from './components/Modal';
import { Options } from './components/Options';
import { About } from './components/About';

const App = () => ({
    oninit: () => {
        const config = getConfig();
        console.log(config);

        if (!config) {
            setConfig({
                autohideMenu: state.autohideMenu,
                editMode: state.editMode,
                boxMap: state.boxMap,
                options: state.options,
                files: state.files,
                scroll: state.scroll
            });
        } else {
            const { autohideMenu, editMode, boxMap, options, files, scroll } = config;
            setAutohideMenu(autohideMenu);
            setEditMode(editMode);
            setBoxMap(boxMap);
            setOptions(options);
            setFiles(files);
            setScroll(scroll);
        }

        setBoxes(Object.values(state.boxMap));

        document.getElementById('newt-styles').innerText = state.options.customCss;
        document.querySelector('html').style.scrollbarColor =
            `${getBrightness(state.options.bgColor) < 120 ? '#404040' : '#999999'} ${state.options.bgColor}`;

        requestAnimationFrame(() => window.scrollTo(state.scroll.x, state.scroll.y));

        const updateScroll = debounce(() => {
            setScroll({
                x: window.scrollX,
                y: window.scrollY
            });
        }, 100);

        document.addEventListener('scroll', updateScroll);
    },

    view: () =>
        m('div.newt',
            state.showOptions &&
                m(Modal, { closeAction: () => setShowOptions(false) },
                    m(Options, { options: state.options })
                )
            ,

            state.showAbout &&
                m(Modal, { closeAction: () => setShowAbout(false) },
                    m(About)
                )
            ,

            m(Controls, {
                autohideMenu: state.autohideMenu,
                editMode: state.editMode
            }),

            state.ctxMenu.mode &&
                m(ContextMenu, { ctxMenu: state.ctxMenu })
            ,

            m('div.stage', {
                className: cls({
                    'bg-grid': state.editMode,
                    '-dark-mode': getBrightness(state.options.bgColor) < 120
                }),

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
                    if (!state.editMode) return;
                    ev.preventDefault();
                    const x = ev.pageX + 1;
                    const y = ev.pageY + 1;

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
                        editMode: state.editMode,
                        isEditing: state.editing[box.id]
                    })
                )
            )
        )
});

m.mount(document.getElementById('app'), App);