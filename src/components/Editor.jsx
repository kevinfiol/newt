import { h } from 'preact';
import { useState } from 'preact/hooks';

const Editor = ({ content, onInput }) => (
    <div className="editor" contentEditable={true}>

    </div>
);

export default Editor;