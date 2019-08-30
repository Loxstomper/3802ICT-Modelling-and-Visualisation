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

canvas.width = 1920;
canvas.height = 1080;

const lge = new LGE(ctx, 4, "scanLine");
const sf: ShapeFactory = new ShapeFactory();

const sounds = {
  thrust: new Audio("./sounds/rocket.mp3"),
  explosion: new Audio("./sounds/explosion.mp3")
};

const fps = 30;
const renderDelay = 1000 / fps;

let i = 0;

const asteroidFactory = () => {
  const x = 50 + Utils.randomInt(canvas.width - 100);
  const y = 50 + Utils.randomInt(canvas.height - 50);

  return new Asteroid({ x, y }, lge.resolution);
};

const asteroids: Asteroid[] = [];
const player: Player = new Player(lge.resolution);

let pressedKey = null;
const getInput = (e: KeyboardEvent) => {
  pressedKey = e.keyCode;
};

let cssSelectedFilter = 0;
const cssFilterList = [
  "",
  "blur(2px)",
  "hue-rotate(90deg)",
  "grayscale(100%)",
  "invert(100%)",
  "saturate(200%)"
];
const cssFilters = () => {
  canvas.style.filter = cssFilterList[cssSelectedFilter];
  cssSelectedFilter = (cssSelectedFilter + 1) % cssFilterList.length;
};

window.addEventListener("keydown", getInput, false);
window.addEventListener("click", cssFilters, false);
// window.addEventListener("keypress", getInput, false);
ctx.font = "30px Arial";

// change this to requestAnimationFrame
let maxNumberAsteroids: number = 25;
let spawnProb: number = 1;
let numberAsteroids: number = 0;

let lastFrameTimeMS = 0;
let delta = 0;

const loop = (timestamp: number) => {
  delta = (timestamp - lastFrameTimeMS) / 1000;
  lastFrameTimeMS = timestamp;

  lge.clear();

  // updates
  player.update(pressedKey, delta);
  pressedKey = null;

  asteroids.forEach((a: Asteroid, index: number) => {
    a.handleCollision(asteroids, index);
  });

  asteroids.forEach((a: Asteroid, index: number) => {
    a.update(delta);
  });

  let prevAsteroids = numberAsteroids;
  numberAsteroids -= player.handleCollision(asteroids);

  if (prevAsteroids !== numberAsteroids) {
    sounds.explosion.play();
  }

  if (
    numberAsteroids < maxNumberAsteroids &&
    Utils.randomInt(10) <= spawnProb
  ) {
    asteroids.push(asteroidFactory());
    numberAsteroids++;
  }

  // drawing
  // player.body.forEach((p: Polygon) => {
  //   lge.drawPolygon(p);
  // });

  const toDraw = [...asteroids, ...player.body];

  if (player.isBoosted) {
    sounds.thrust.play();
    toDraw.push(...player.flames);
  }

  lge.drawPolygonBuffer(toDraw);

  ctx.fillStyle = Colours.white.toString();
  ctx.fillText(`Score: ${player.score}`, 10, 50);
  ctx.fillText(`FPS: ${Math.floor(1 / delta)}`, 10, 100);

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
