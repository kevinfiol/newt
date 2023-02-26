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

            return `<img src="${src}" title="${title || 'markdown image'}" alt="${text}"></img>`;
        }
    }
});

let ID = 1;
export function generateId() {
    let id;

    do {
        id = 'box-' + ID++;
    } while (id in state.boxMap);

    return id;
}

const isObj = x => x && Object.getPrototypeOf(x) === Object.prototype;

export const renderMarkdown = (markdown) => marked(markdown);

export function debounce(callback, wait = 1000) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, wait);
    };
}

export function cls(obj, classes) {
    classes = '';

    for (k in obj) {
        if (obj[k]) {
            if (classes) classes += ' ';
            classes += k;
        }
    }

    return classes;
}

// deep merge with structural sharing
export function merge(obj, ...patches) {
  obj = Array.isArray(obj) ? [ ...obj ] : { ...obj };

  for (let patch of patches) {
    for (let k in patch) {
      let v = patch[k];
      if (typeof v === 'function') obj[k] = v(obj[k]);
      else if (isObj(v) && isObj(obj[k])) obj[k] = merge(obj[k], v);
      else if (v === void 0) delete obj[k];
      else obj[k] = v;
    }
  }

  return obj;
}

export function getBrightness(hexcode) {
    // https://archive.ph/gCueb
    const color = hexcode.substring(1); // strips #
    const rgb = parseInt(color, 16);

    // extract rgb
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
