import m from 'mithril';
import { state, actions } from '../state';
import { storage } from '../storage';
import { debounce } from '../util';
import { ColorPicker, Editor, LocalImages, FileImport } from './index';
import * as effect from '../effects';


export const Options = ({ attrs: { options } }) => {
    const persistChanges = debounce(actions.saveToStorage, 1000);
    const setOptions = (patch) => actions.setState({ options: patch });

    return {
        view: () =>
            m('div.options',
                m('h1', 'Options'),

                m('input', {
                    type: 'checkbox',
                    id: 'autohide-checkbox',
                    checked: state.autohideMenu,
                    onchange: ({ target: { checked } }) => {
                        actions.setState({ autohideMenu: checked });
                        persistChanges();
                    }
                }),
                m('label', { for: 'autohide-checkbox' }, '  Auto-hide Controls'),

                m('div.group',
                    m('div.input-group',
                        m('h2', 'Font Family'),
                        m('input.text-input', {
                            type: 'text',
                            oncreate: ({ dom }) => dom.value = options.fontFamily,
                            oninput: ({ target: { value } }) => {
                                setOptions({ fontFamily: value });
                                persistChanges();
                            }
                        }),
                    ),

                    m('div.input-group',
                        m('h2', 'Font Color'),
                        m(ColorPicker, {
                            initialValue: options.color,
                            onChange: (color) => {
                                setOptions({ color });
                                persistChanges();
                            }
                        }),
                    ),

                    m('div.input-group',
                        m('h2', 'Background Color'),
                        m(ColorPicker, {
                            initialValue: options.bgColor,
                            onChange: (color) => {
                                setOptions({ bgColor: color });
                                persistChanges();
                                effect.setScrollbarColor(color);
                            }
                        }),
                    )
                ),

                m('h2', 'Custom CSS'),
                m('p', 'Use the ', m('code', '.content'), ' class to scope styles to boxes.'),
                m(Editor, {
                    lineNumbers: true,
                    editorContent: options.customCss,
                    syntax: 'css',
                    onInput: (val) => {
                        setOptions({ customCss: val });
                        effect.setStyles(val);
                        persistChanges();
                    }
                }),

                m('h2', 'Local Images'),
                m(LocalImages, {
                    files: state.files
                }),

                m('h2', 'Import / Export Config'),
                m(FileImport, {
                    userConfig: {
                        editMode: state.editMode,
                        options: state.options,
                        boxMap: state.boxMap,
                        scroll: state.scroll
                    }
                }),

                m('h2', 'Danger Zone'),
                m('p', 'Resetting to defaults will also clear your saved settings.'),
                m('button.button', {
                    onclick: async () => {
                        await storage.clearConfig();
                        actions.resetToDefaults();
                        actions.setShowOptions(false);
                    }
                }, 'Restore Defaults')
            )
    };
};