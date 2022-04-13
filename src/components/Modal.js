import m from 'mithril';

export const Modal = () => ({
    onbeforeremove: ({ dom }) => {
        return new Promise((resolve) =>
            dom.addEventListener('animationend', resolve)
        );
    },

    view: ({ children }) =>
        m('div.modal',
            m('div.container',
                children
            )
        )
});