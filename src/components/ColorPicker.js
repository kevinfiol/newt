import m from 'mithril';

export const ColorPicker = () => ({
    view: ({ attrs: { initialValue, onChange } }) =>
        m('input', {
            type: 'color',
            onchange: ({ target: { value } }) => onChange(value),
            oncreate: ({ dom }) => dom.value = initialValue || '#000000'
        })
});
