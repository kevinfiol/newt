import m from 'mithril';
import { addBox, toggleEdit, removeBox, clearCtxMenu } from '../state';

const Item = (name, action) => (
    m('button', {
        onmousedown: (ev) => {
            if (ev.button === 0) action(ev);
            clearCtxMenu();
        }
    }, name)
);

const MenuItems = (mode, props) => {
    switch (mode) {
        case 'box': {
            return [
                Item('delete box', () => removeBox(props.id)),
                Item('edit', () => toggleEdit(props.id))
            ];
        }

        case 'container': {
            return [
                Item('add box', () => addBox(props.x, props.y))
            ];
        }

        default: {
            return [];
        }
    }
};

export const ContextMenu = () => ({
    view: ({ attrs: { ctxMenu } }) =>
        m('div.context-menu', {
            style: { left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }
        },
            MenuItems(ctxMenu.mode, ctxMenu.props)
        )
});