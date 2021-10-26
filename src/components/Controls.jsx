import { h } from 'preact';
import { incrementId } from '../actions';

const Controls = () => (
    <div className="controls">
        <button onClick={incrementId}>Add Box</button>
    </div>
);

export default Controls;