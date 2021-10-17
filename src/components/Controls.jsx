import { h, Fragment } from '../jsx';
import { AddBox } from '../state/actions';

const Controls = () => (
    <>
        <div className="controls">
            <button onclick={AddBox}>Add Box</button>
        </div>
    </>
);

export default Controls;