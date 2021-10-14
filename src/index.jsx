import { app } from 'hyperapp';
import h from './jsx';

import Controls from './components/Controls';

const initialState = {
    boxes: []
};

const Newt = state => (
    <div>
        <Controls />
        <pre>
            {JSON.stringify(state.boxes)}
        </pre>
    </div>
);

app({
    init: initialState,
    view: Newt,
    node: document.getElementById('app')
});