import m from 'mithril';
import CodeMirror from 'codemirror';
import markdown from 'codemirror/mode/markdown/markdown';
import css from 'codemirror/mode/css/css';
import comment from 'codemirror/addon/comment/comment';
import keymap from 'codemirror/keymap/sublime';

export const Editor = ({ attrs: { editorContent, syntax, onInput, lineNumbers } }) => {
    let cm;

    return {
        oncreate: ({ dom }) => {
            cm = new CodeMirror(dom, {
                value: editorContent,
                mode: syntax,
                lineNumbers: lineNumbers || false,
                theme: 'base16-dark',
                keyMap: 'sublime'
            });

            cm.on('change', (cmInstance) => {
                onInput(cmInstance.getValue());
                m.redraw();
            });
        },

        ondestroy: () => {
            cm = undefined;
        },

        view: () =>
            m('div.editor')
    };
};
