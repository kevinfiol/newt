import m from 'mithril';
import { addBox, toggleEdit, removeBox } from '../state';

const Item = (name, action) => (
    m('button', {
        onmousedown: (ev) =>
            ev.button === 0 && action(ev)
    }, name)
);

const MenuItems = (mode, config) => {
    switch (mode) {
        case 'box': {
            return [
                Item('delete box', () => removeBox(config.id)),
                Item('edit', () => toggleEdit(config.id))
            ];
        }

        case 'container': {
            return [
                Item('add box', () => addBox(config.x, config.y))
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
            MenuItems(ctxMenu.mode, ctxMenu.config)
        )
});