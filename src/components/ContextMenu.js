import m from 'mithril';
import { removeBox } from '../state';

const MenuItems = () => ({
    view: ({ attrs: { mode, config } }) => {
        switch (mode) {
            case 'box': {
                return [
                    m('button', {
                        onmousedown: () => removeBox(config.id)
                    }, 'delete box')
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