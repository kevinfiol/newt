import m from 'mithril';
import { state } from './state';
import { Controls } from './components/Controls';
import { Box } from './components/Box';

const App = () => ({
    view: () =>
        m('div.container',
            m(Controls),

            m('div.stage',
                state.boxes.map(box =>
                    m(Box, {
                        key: box.id,
                        id: box.id,
                        content: box.content
                    })
                )
            )
        )
});

m.mount(document.getElementById('app'), App);