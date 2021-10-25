import { h, render } from 'preact';
import { useStore } from './store';
import Controls from './components/Controls';

const Newt = () => {
    const [state] = useStore();

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
