import { h, text } from 'hyperapp';

const jsx = (type, props, ...children) =>
    typeof type === "function"
        ? type(props, children)
        : h(
            type,
            props || {},
            []
                .concat(...children)
                .map(any =>
                    typeof any === "string" || typeof any === "number" ? text(any) : any
                )
          );

jsx.Fragment = (_, children) => children;

export default jsx;