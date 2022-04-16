import m from 'mithril';
import { debounce } from '../util';
import { ColorPicker } from './ColorPicker';

export const Options = ({ attrs: { options } }) => {
    let bgColor = options.bgColor;
    let fontFamily = options.fontFamily;

    const saveChanges = () => {
        // debounce and save to localStorage on changes
    };

    return {
        view: () =>
            m('div.options',
                m('h1', 'options'),

                m('h2', 'font family'),
                m('input', {
                    type: 'text',
                    oncreate: ({ dom }) => dom.value = fontFamily,
                    oninput: ({ target: { value } }) => fontFamily = value
                }),

                m('h2', 'background color'),
                m(ColorPicker, {
                    initialValue: bgColor,
                    onChange: (color) => {
                        bgColor = color;
                        console.log(bgColor);
                        m.redraw();
                    }
                })
            )
    };
};