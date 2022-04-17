import m from 'mithril';
import { saveToStorage, setOptions } from '../state';
import { debounce } from '../util';
import { ColorPicker } from './ColorPicker';
import { Editor } from './Editor';

export const Options = ({ attrs: { options } }) => {
    const styleTag = document.getElementById('newt-styles');
    const persistChanges = debounce(saveToStorage, 1500);

    return {
        view: () =>
            m('div.options',
                m('h1', 'options'),

                m('h2', 'font family'),
                m('input', {
                    type: 'text',
                    oncreate: ({ dom }) => dom.value = options.fontFamily,
                    oninput: ({ target: { value } }) => {
                        setOptions({ fontFamily: value });
                        persistChanges();
                    }
                }),

                m('h2', 'font color'),
                m(ColorPicker, {
                    initialValue: options.color,
                    onChange: (color) => {
                        setOptions({ color });
                        persistChanges();
                    }
                }),

                m('h2', 'background color'),
                m(ColorPicker, {
                    initialValue: options.bgColor,
                    onChange: (color) => {
                        setOptions({ bgColor: color });
                        persistChanges();
                    }
                }),

                m('h2', 'custom css'),
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
            )
    };
};