import { Asteroid } from "./Asteroid";
import { Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { LGE } from "./LGE";
import { Matrix } from "./Matrix";
import { Polygon } from "./Polygon";
import { ShapeFactory } from "./ShapeFactory";
import { Utils } from "./Utils";

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

const lge = new LGE(ctx, 1, "scanLine");
const sf: ShapeFactory = new ShapeFactory();

const square: Polygon = sf.square(350, 350, 100, 100);

let fps = 30;
let renderDelay = 1000 / fps;

let i = 0;

const asteroidFactory = () => {
  const x = 50 + Utils.randomInt(700);
  const y = 50 + Utils.randomInt(700);

  return new Asteroid({ x, y }, lge.resolution);
};

let asteroids: Asteroid[] = [];

// change this to requestAnimationFrame
const loop = () => {
  lge.clear();

  asteroids.forEach((a: Asteroid) => {
    a.update();
    lge.scanLineFill(a, Colours.black);
    lge.drawPolygon(a.boundingBox, Colours.green);
  });

  setTimeout(loop, renderDelay);
};

// requestAnimationFrame(loop);

asteroids.push(asteroidFactory());
asteroids.push(asteroidFactory());
asteroids.push(asteroidFactory());
asteroids.push(asteroidFactory());
asteroids.push(asteroidFactory());
asteroids.push(asteroidFactory());

loop();
