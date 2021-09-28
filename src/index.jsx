import { app } from 'hyperapp';
import h from './jsx';

const initialState = {
    foo: 5
};

const Newt = state => (
    <div>
        <p>hello world</p>
        <>
            <div>nah</div>
        </>
    </div>
);

app({
    init: initialState,
    view: Newt,
    node: document.getElementById('app')
});