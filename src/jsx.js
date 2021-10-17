import { h as hyperscript, text } from 'hyperapp';

const h = (type, props, ...children) =>
    typeof type === "function"
        ? type(props, children)
        : hyperscript(
            type,
            props || {},
            []
                .concat(...children)
                .map(any =>
                    typeof any === "string" || typeof any === "number" ? text(any) : any
                )
          );

const Fragment = (_, children) => children;

export { h, Fragment };