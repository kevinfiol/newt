import m from 'mithril';
import { loadFromObject, saveToStorage, setShowOptions, resetToDefaults } from '../state';
import { clearConfig } from '../storage';
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
                m(FileInput, { onLoad: (res) => data = res }),

                m('button.button', {
                    disabled: !data,
                    onclick: () => {
                        if (!data) return;
                        const obj = JSON.parse(data);
                        loadFromObject(obj);
                        setShowOptions(false);
                        saveToStorage();
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
                }, 'Export'),

                m('button.button', {
                    onclick: () => {
                        clearConfig();
                        resetToDefaults();
                        setShowOptions(false);
                        saveToStorage();
                    }
                }, 'Restore Defaults')
            )
    };
};