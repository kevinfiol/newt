import m from 'mithril';

export const Modal = ({ attrs: { closeAction } }) => {
    let modalRef;

    return {
        oncreate: ({ dom }) => {
            modalRef = dom;
        },

        onbeforeremove: ({ dom }) => {
            return new Promise((resolve) =>
                dom.addEventListener('animationend', resolve)
            );
        },

        view: ({ children }) =>
            m('div.modal', {
                onclick: ({ target }) => {
                    if ((modalRef === target) && closeAction) {
                        closeAction();
                        modalRef.remove(); // clean up dom
                        modalRef = undefined;
                    }
                }
            },
                m('div.container',
                    children
                )
            )
    };
};