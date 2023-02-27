import m from 'mithril';
import { generateId } from '../util';
import { actions } from '../state';
import { FileInput } from './FileInput';

const ImageRow = () => ({
    view: ({ attrs: { id, url, removeFile } }) =>
        m('div.image-row',
            m('img.icon', { src: url, style: { height: '50px', width: '50px' } }),

            m('input.markdown', {
                type: 'text',
                value: `![${id}](local_${id})`,
                readonly: true,
                onclick: ({ target }) => target.select()
            }),

            m('div.controls',
                m('button.button', { onclick: removeFile }, 'Remove')
            )
        )
});

export const LocalImages = () => {
    let inputEl = null;
    let fileToStore = null;
    let error = '';

    return {
        view: ({ attrs: { files } }) =>
            m('div.local-images',
                m('div.controls',
                    m(FileInput, {
                        dataType: 'dataURL',
                        oncreate: ({ dom }) => inputEl = dom,
                        onLoad: (res) => fileToStore = res,
                        checkValid: (file) => {
                            if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
                                error = 'Image must be of .jpg, .png, or .gif format.';
                                return false;
                            }

                            return true;
                        }
                    }),

                    m('button.button', {
                        disabled: !fileToStore || error,
                        onclick: () => {
                            if (fileToStore !== null) {
                                let stored = false;

                                while (!stored) {
                                    let id = generateId(files, 'img');
                                    if (!(id in files)) {
                                        actions.setLocalFile(id, fileToStore);
                                        fileToStore = null;
                                        inputEl.value = null;
                                        stored = true;
                                        actions.saveToStorage();
                                    }
                                }
                            }
                        }
                    }, 'Load'),
                ),

                error &&
                    m('p', error)
                ,

                m('div.row-container',
                    Object.keys(files).length > 0
                        ? Object.entries(files).map(([id, file]) =>
                            m(ImageRow, {
                                key: id,
                                id: id,
                                url: file,
                                removeFile: () => {
                                    actions.removeLocalFile(id);
                                    actions.saveToStorage();
                                }
                            })
                        )
                        : m('div', m('em', 'No images loaded.'))
                    ,
                )
            )
    };
};