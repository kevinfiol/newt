import m from 'mithril';
import { state, setBoxMap, setBoxes } from './state';
import { getConfig, setConfig } from './storage';
import { Controls } from './components/Controls';
import { Box } from './components/Box';

const App = () => ({
    oninit: () => {
        const config = getConfig();
        if (!config) setConfig(state.boxMap);
        else setBoxMap(config);

        const boxes = Object.values(state.boxMap);
        setBoxes(boxes);
        console.log(state);
    },

    view: () =>
        m('div.container',
            m(Controls),

            m('div.stage',
                state.boxes.map(box =>
                    m(Box, { key: box.id, config: box })
                )
            )
        )
});

m.mount(document.getElementById('app'), App);