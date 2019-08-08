import { Asteroid } from "./Asteroid";
import { Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { LGE } from "./LGE";
import { Matrix } from "./Matrix";
import { Polygon } from "./Polygon";
import { ShapeFactory } from "./ShapeFactory";

/**
 * Get reference to the canvas element and its 2D rendering context
 */
const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

/**
 * Set the width here not in the HTML
 */
canvas.width = 800;
canvas.height = 800;

/**
 * Instantiate the graphics engine - using the scanLine fill method
 */
const lge = new LGE(ctx, 1, "scanLine");

/**
 * Instantiate Shape Factory
 */
const sf: ShapeFactory = new ShapeFactory();

const square: Polygon = sf.square(300, 210, 100, 100);

const drawBuffer = [];

// drawBuffer.push({func : lge.fillPolygon, args : [square, Colours.white]});
drawBuffer.push({ poly: square, colour: Colours.white });
// drawBufferExecute();

// lge.drawPolygon(drawBuffer[0].args[0], drawBuffer[0].args[1]);

const a = new Asteroid({ x: 400, y: 400 });

let x: number = 200;
let times: number = 0;

const run = () => {
  // console.log(drawBuffer);
  lge.clear();

  lge.scanLineFill(a, Colours.white);
  a.translate(x, 0);

  x++;

  if (x > 300) {
    x = 200;
    a.translate(x, 0);
  }

  console.log(a.points[0]);

  times++;

  // if (times > 5) {
  //   alert("1");
  // }

  window.requestAnimationFrame(run);
};

// run();

lge.scanLineFill(a, Colours.white);
// console.log(a.points);
// a.translate(25, 25);
// console.log(a.points);
// lge.scanLineFill(a, Colours.white);
// a.rotate(-22.5);
// console.log(a.points);
// lge.scanLineFill(a, Colours.red);

// lge.drawPolygon(a.boundingBox, Colours.black);
