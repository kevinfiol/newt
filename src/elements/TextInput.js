class TextInput extends HTMLInputElement {
    constructor() {
        super();
        this.addEventListener('click', () => alert('hello'));
    }
}

customElements.define('text-input', TextInput, { extends: 'input' });

export default TextInput;