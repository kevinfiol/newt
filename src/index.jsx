import { h, Fragment, render } from 'preact';
import { useStore } from './store';
import Controls from './components/Controls';
import Box from './components/Box';

const Newt = () => {
    const [state] = useStore();

    return (
        <>
             <Controls />

             <br /><br />

             <div>{state.id}</div>


{/*             <div className="stage">
                {state.boxes.map(box =>
                    <Box
                        key={box.content}
                        // id={box.id}
                        content={box.content}
                    />
                )}
             </div>*/}
        </>
    );
};

render(<Newt />, document.getElementById('app'));
