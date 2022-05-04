import m from 'mithril';
import { state } from '../state';
import { saveToStorage, setOptions, setAutohideMenu, resetToDefaults, setShowOptions } from '../state';
import { browserStorage } from '../storage';
import { debounce, getBrightness } from '../util';
import { ColorPicker } from './ColorPicker';
import { Editor } from './Editor';
import { LocalImages } from './LocalImages';
import { FileImport } from './FileImport';

export const Options = ({ attrs: { options } }) => {
    const styleTag = document.getElementById('newt-styles');
    const persistChanges = debounce(saveToStorage, 1500);

    return {
        view: () =>
            m('div.options',
                m('h1', 'Options'),

                m('input', {
                    type: 'checkbox',
                    id: 'autohide-checkbox',
                    checked: state.autohideMenu,
                    onchange: ({ target: { checked } }) => {
                        setAutohideMenu(checked);
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
                                document.querySelector('html').style.scrollbarColor =
                                    `${getBrightness(color) < 120 ? '#404040' : '#999999'} ${color}`;
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
                        styleTag.innerText = val;
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
                        await browserStorage.clearConfig();
                        resetToDefaults();
                        setShowOptions(false);
                        saveToStorage();
                        m.redraw();
                    }
                }, 'Restore Defaults')
            )
    };
};