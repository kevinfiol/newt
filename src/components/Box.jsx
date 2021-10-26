import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import Movable from '../lib/Movable';

const Box = ({ content }) => {
    const box = useRef();
    const boxEl = useRef();

    useEffect(() => {
        box.current = new Movable(boxEl.current);
        console.log(box.current);

        return () => {
            console.log('destroy box');
            box.current.destroy();
            box.current = undefined;
            boxEl.current = undefined;
        };
    }, [])

    return (
        <div className="box" ref={boxEl}>
            {content}
        </div>
    );
};

export default Box;