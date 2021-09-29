// import { app } from 'hyperapp';
// import h from './jsx';

// const initialState = {
//     foo: 5
// };

// const Newt = state => (
//     <div>
//         <p>hello world</p>
//         <>
//             <div>nah</div>
//         </>
//     </div>
// );

// app({
//     init: initialState,
//     view: Newt,
//     node: document.getElementById('app')
// });

const boxes = document.getElementsByClassName('box');
const CELL_SIZE = 25;

for (let box of boxes) {
    box.style.position = 'absfolute';

    box.addEventListener('mousedown', ev => {
        ev.preventDefault();
        // cancel if not left-click
        if (ev.button != 0) return;

        const widthOffset = ev.clientX - box.offsetLeft;
        const heightOffset = ev.clientY - box.offsetTop;

        function mousemove(ev) {
            let x = ev.clientX - widthOffset;
            let y = ev.clientY - heightOffset;

            x = Math.round(x / CELL_SIZE) * CELL_SIZE;
            y = Math.round(y / CELL_SIZE) * CELL_SIZE;

            box.style.left = x + 'px';
            box.style.top = y + 'px';
        }

        function mouseup(ev) {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        }

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    });
}

// onMouseDown React listener that attaches mousemove/mouseup listeners on the window. I round the numbers to the grid.