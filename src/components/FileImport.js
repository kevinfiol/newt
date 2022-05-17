import m from 'mithril';
import { actions } from '../store';
import { FileInput } from './FileInput';

export const FileImport = ({ attrs: { userConfig } }) => {
    let data = null;

    let url = URL.createObjectURL(
        new Blob([
            JSON.stringify(userConfig)
        ], { type: 'application/json' })
    );

    return {
        view: () =>
            m('div.file-import',
                m('p', 'Options and Boxes are exported. Local Images are not exported.'),

                m(FileInput, { onLoad: (res) => data = res }),

                m('button.button', {
                    disabled: !data,
                    onclick: () => {
                        if (!data) return;
                        const obj = JSON.parse(data);
                        actions.loadFromObject(obj);
                        actions.setShowOptions(false);
                    }
                }, 'Load'),

                m('a.button-link', {
                    href: url,
                    download: (() => {
                        const d = new Date();
                        const Y = d.getFullYear();
                        const M = d.getMonth() + 1;
                        const D = d.getDate();
                        return `${Y}-${M}-${D}_newt-config.json`;
                    })(),
                }, 'Export')
            )
    };
};