import m from 'mithril';
import { actions } from '../state';

const Item = (name, action) => (
    m('button.button', {
        onmousedown: (ev) => {
            if (ev.button === 0) action(ev);
            actions.clearCtxMenu();
        }
    }, name)
);

const MenuItems = (mode, props) => {
    switch (mode) {
        case 'box': {
            return [
                Item('Edit', () => actions.toggleEdit(props.id)),
                Item('Delete', () => actions.removeBox(props.id)),
                Item('Copy ID', () => navigator.clipboard.writeText('.' + props.id))
            ];
        }

        case 'container': {
            return [
                Item('New Box', () => actions.addBox(props.x, props.y)),
                Item('Options', () => actions.setShowOptions(true))
            ];
        }

        default: {
            return [];
        }
    }
};

export const ContextMenu = () => ({
    onbeforeremove: ({ dom }) => {
        dom.classList.add('fade-out');
        return new Promise((resolve) => {
            dom.addEventListener('animationend', () => {
                dom.remove();
                resolve();
            });
        });
    },

    view: ({ attrs: { ctxMenu } }) =>
        m('div.context-menu.fade-in', {
            style: {
                left: ctxMenu.x + 'px',
                top: ctxMenu.y + 'px'
            }
        },
            MenuItems(ctxMenu.mode, ctxMenu.props)
        )
});