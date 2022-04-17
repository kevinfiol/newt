import m from 'mithril';
import CodeMirror from 'CodeMirror';
import markdown from 'CodeMirror/mode/markdown/markdown';
import css from 'CodeMirror/mode/css/css';
import comment from 'CodeMirror/addon/comment/comment';
import keymap from 'CodeMirror/keymap/sublime';

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
