import m from 'mithril';

export const FileInput = ({ attrs: { onLoad } }) => {
    let io = new FileReader();

    io.onload = (load) => {
        onLoad(load.target.result);
        m.redraw();
    };

    return {
        view: ({ attrs: { dataType, checkValid } }) =>
            m('input.file-input', {
                type: 'file',
                oninput: ({ target }) => {
                    const file = target.files[0];
                    const isValid = checkValid ? checkValid(file) : true;

                    if (isValid) {
                        if (dataType === 'dataURL') io.readAsDataURL(file);
                        else io.readAsText(file);
                    }
                }
            })
    };
};