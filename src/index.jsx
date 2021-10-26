import { h, Fragment, render } from 'preact';
import { useStore } from './store';
import Controls from './components/Controls';
import Box from './components/Box';

const Newt = () => {
    const [state] = useStore();

    return (
        <>
             <Controls />

             <div className="stage">
                {state.boxes.map(box =>
                    <Box
                        key={box.content}
                        content={box.content}
                    />
                )}
             </div>
        </>
    );
};

render(<Newt />, document.getElementById('app'));
