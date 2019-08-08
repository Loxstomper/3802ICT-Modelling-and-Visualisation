import {Colours} from './Colour';
import {Point} from './Point';
import {ShapeFactory} from './ShapeFactory';
import {Polygon} from './Polygon';
import {LGE} from './LGE';
import {Matrix} from './Matrix';



/**
 * Get reference to the canvas element and its 2D rendering context
 */
const canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas");
const ctx    : CanvasRenderingContext2D = canvas.getContext("2d");

/**
 * Set the width here not in the HTML
 */
canvas.width  = 800;
canvas.height = 800;

/**
 * Instantiate the graphics engine - using the scanLine fill method
 */
const lge = new LGE(ctx, 4, 'scanLine');

/**
 * Instantiate Shape Factory
 */
const sf : ShapeFactory = new ShapeFactory();


let points : Point[];

let square : Polygon = sf.square(300, 210, 100, 100);

let drawBuffer = [];

const drawBufferExecute = () => {
    drawBuffer.forEach(x => {
        console.log(x);
        // cant use ...x.args :(
        x.func(x.args[0], x.args[1]);
    })    
}

// drawBuffer.push({func : lge.fillPolygon, args : [square, Colours.white]});
drawBuffer.push({poly : square, colour : Colours.white});
// drawBufferExecute();

// lge.drawPolygon(drawBuffer[0].args[0], drawBuffer[0].args[1]);


// const run = () => {
//     // console.log(drawBuffer);
//     lge.clear();
//     lge.drawPolygonBuffer(drawBuffer);
//     // drawBufferExecute();
//     window.requestAnimationFrame(run);
// }

// run();





lge.drawPolygon(square, Colours.white);

lge.setRotation(Math.PI / 4);
lge.setTranslation(100, 100);

lge.drawPolygon(square, Colours.black);


let a : Matrix = new Matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);

let b : Matrix = new Matrix([
    [2],
    [2],
    [1]
]);

let c = a.multiply(b);
console.log('RESULT');
console.log(c.values);


// let c : Matrix = a.multiply(b);

// console.log('C');
// console.log(c.values);





