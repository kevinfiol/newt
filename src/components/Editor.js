import m from 'mithril';
import CodeMirror from 'CodeMirror';
import markdown from 'CodeMirror/mode/markdown/markdown';
import css from 'CodeMirror/mode/css/css';
import comment from 'CodeMirror/addon/comment/comment';
import keymap from 'CodeMirror/keymap/sublime';

const Editor = {
    view: ({ attrs: { editorContent, syntax, oninput } }) =>
        m('div', {
            oncreate: ({ dom }) => {
                const cm = new CodeMirror(dom, {
                    value: editorContent,
                    mode: syntax,
                    lineNumbers: true,
                    theme: 'base16-dark',
                    keyMap: 'sublime'
                });

                cm.on('change', cm => {
                    oninput(cm.getValue());
                    m.redraw();
                });
            }
        })
};

export default Editor;