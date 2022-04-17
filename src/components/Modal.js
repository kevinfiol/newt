import m from 'mithril';

export const Modal = ({ attrs: { closeAction } }) => {
    let modalRef;

    return {
        oncreate: ({ dom }) => {
            modalRef = dom;
        },

        onbeforeremove: ({ dom }) => {
            dom.classList.add('fade-out');
            return new Promise((resolve) => {
                dom.addEventListener('animationend', () => {
                    dom.remove();
                    resolve();
                });
            });
        },

        view: ({ children }) =>
            m('div.modal.fade-in', {
                onmousedown: ({ target }) => {
                    if ((modalRef === target) && closeAction) {
                        closeAction();
                    }
                }
            },
                m('div.container',
                    children
                )
            )
    };
};