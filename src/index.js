import m from 'mithril';
import cls from 'classies';
import { NewtStore, actions } from './store';
import { getBrightness, debounce } from './util';
import { storage } from './storage';
import { Controls, ContextMenu, Box, Modal, Options, About } from './components';
import * as effect from './effects';

const Newt = () => ({
    view: ({ attrs: { state } }) =>
        m('div.newt.fade-in', { className: cls({ 'overflow-hidden': state.scroll.lock }) },
            state.showOptions &&
                m(Modal, { closeAction: () => actions.setShowOptions(false) },
                    m(Options, { state, options: state.options })
                )
            ,

            state.showAbout &&
                m(Modal, { closeAction: () => actions.setState({ showAbout: false }) },
                    m(About)
                )
            ,

            m(Controls, {
                autohideMenu: state.autohideMenu,
                editMode: state.editMode,
                scrollLock: state.scroll.lock
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
                        actions.clearCtxMenu();
                    }
                },

                oncontextmenu: (ev) => {
                    if (!state.editMode) return;
                    ev.preventDefault();

                    const x = ev.pageX + 1;
                    const y = ev.pageY + 1;

                    actions.setState({
                        ctxMenu: {
                            mode: 'container',
                            x,
                            y,
                            props: { x, y }
                        }
                    });
                }
            },
                state.boxes.map((box) =>
                    m(Box, {
                        key: box.id,
                        config: box,
                        editMode: state.editMode,
                        isEditing: state.editing[box.id],
                        zIndex: state.boxStackOrder.indexOf(box.id) + 1
                    })
                )
            )
        )
});

m.mount(document.getElementById('app'), () => {
    let state;
    NewtStore.sub((val) => state = val);

    storage.getConfig().then((config) => {
        // if no config in local storage
        if (!config || Object.keys(config).length == 0) {
            actions.resetToDefaults();

            return storage.setConfig({
                autohideMenu: state.autohideMenu,
                editMode: state.editMode,
                boxMap: state.boxMap,
                options: state.options,
                files: state.files,
                scroll: state.scroll
            });
        } else {
            const {
                autohideMenu,
                editMode,
                boxMap,
                boxStackOrder,
                options,
                files,
                scroll
            } = config;

            actions.setState({
                autohideMenu,
                boxMap,
                boxStackOrder,
                options,
                files
            });

            actions.setEditMode(editMode);
            actions.setScroll(scroll);
        }
    }).then(() => {
        // complete loading
        actions.setState({
            isLoaded: true,
            boxes: Object.values(state.boxMap)
        });

        // Use Effects
        effect.enableScrolling(() => (state.showOptions || state.showAbout)); // enables drag scrolling
        effect.setStyles(state.options.customCss);
        effect.setScrollbarColor(state.options.bgColor);
        effect.setWindowScroll(state.scroll);
        effect.registerScrollListener(
            debounce(() =>
                actions.setScroll({
                    x: window.scrollX,
                    y: window.scrollY
                }),
            100)
        );
    }).then(
        m.redraw
    );

    return {
        view: () => state.isLoaded && m(Newt, { state })
    };
});