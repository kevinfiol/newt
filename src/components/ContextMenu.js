import m from 'mithril';
import { removeBox } from '../state';

const Item = (name, action) => (
    m('button', {
        onmousedown: (ev) =>
            ev.button === 0 && action()
    }, name)
);

const MenuItems = () => ({
    view: ({ attrs: { mode, config } }) => {
        switch (mode) {
            case 'box': {
                return [
                    Item('delete box', () => removeBox(config.id))
                ];
            }

            default: {
                return [];
            }
        }
    }
})

export const ContextMenu = () => {
    return {
        view: ({ attrs: { ctxMenu } }) =>
            m('div.context-menu', {
                style: { left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }
            },
                m(MenuItems, {
                    mode: ctxMenu.mode,
                    config: ctxMenu.config
                })
            )
    };
};