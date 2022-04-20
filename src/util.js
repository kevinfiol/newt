import hexoid from 'hexoid';
import { marked } from 'marked';
import { state } from './state';

marked.use({
    renderer: {
        image: (href, title, text) => {
            let src = href;
            if (src.slice(0, 6) === 'local_') {
                const id = src.slice(6);
                src = state.files[id];
            }

            return `<img src="${src}" title="${title || 'local image'}" alt="${text}"></img>`;
        }
    }
});

export const renderMarkdown = (markdown) => marked(markdown);

export const generateId = hexoid();

export const debounce = (callback, wait = 1000) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, wait);
    };
};

export const getBrightness = (hexcode) => {
    // https://archive.ph/gCueb
    const color = hexcode.substring(1); // strips #
    const rgb = parseInt(color, 16);

    // extract rgb
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
