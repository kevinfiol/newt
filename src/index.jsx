import { h, render } from 'preact';
import { useEffect, useReducer } from 'preact/hooks';
import { store } from './store';
import Controls from './components/Controls';

const Newt = () => {
    const [state, dispatch] = useReducer(store.reducer, store.init());
    useEffect(() => store.listen(dispatch));

    return (
        <div>
             <Controls />
             <pre>
                 {JSON.stringify(state.boxes)}
             </pre>
        </div>
    );
};

render(<Newt />, document.getElementById('app'));
