import { Asteroid } from "./Asteroid";
import { Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { LGE } from "./LGE";
import { Matrix } from "./Matrix";
import { Polygon } from "./Polygon";
import { ShapeFactory } from "./ShapeFactory";
import { Utils } from "./Utils";
import { Player } from "./Player";

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

const asteroids: Asteroid[] = [];
const player: Player = new Player();

let pressedKey = null;
const getInput = (e: KeyboardEvent) => {
  pressedKey = e.keyCode;
};

window.addEventListener("keydown", getInput, false);

// change this to requestAnimationFrame
const loop = () => {
  lge.clear();

  player.update(pressedKey);

  player.body.forEach((p: Polygon) => {
    lge.drawPolygon(p);
  });

  asteroids.forEach((a: Asteroid) => {
    a.update();
    lge.drawPolygon(a);
    lge.drawPolygon(a.boundingBox);
  });

  pressedKey = null;

  setTimeout(loop, renderDelay);
};

// requestAnimationFrame(loop);

asteroids.push(asteroidFactory());

loop();
