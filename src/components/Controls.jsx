import { h } from 'preact';
import { addBox } from '../actions';

const Controls = () => (
    <div className="controls">
        <button onClick={addBox}>Add Box</button>
    </div>
);

export default Controls;