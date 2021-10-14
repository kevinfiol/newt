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

console.log('hi');

import Movable from './lib/Movable';

const boxes = document.getElementsByClassName('box');

/** @type {HTMLElement} **/
const box = (boxes[0]);
/** @type {HTMLElement} **/
const box2 = (boxes[1]);

new Movable(box);
new Movable(box2)