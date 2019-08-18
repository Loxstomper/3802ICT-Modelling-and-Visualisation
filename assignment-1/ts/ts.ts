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

const lge = new LGE(ctx, 4, "scanLine");
const sf: ShapeFactory = new ShapeFactory();

const fps = 30;
const renderDelay = 1000 / fps;

let i = 0;

const asteroidFactory = () => {
  const x = 50 + Utils.randomInt(canvas.width - 100);
  const y = 50 + Utils.randomInt(canvas.height - 50);

  return new Asteroid({ x, y }, lge.resolution);
};

const asteroids: Asteroid[] = [];
const player: Player = new Player();

let pressedKey = null;
const getInput = (e: KeyboardEvent) => {
  pressedKey = e.keyCode;
};

window.addEventListener("keydown", getInput, false);
ctx.font = "30px Arial";

// change this to requestAnimationFrame
let maxNumberAsteroids: number = 5;
let spawnProb: number = 1;
let numberAsteroids: number = 0;

const loop = () => {
  // lge.clear();
  lge.clearSmart(asteroids, player);

  player.update(pressedKey);

  player.body.forEach((p: Polygon) => {
    lge.drawPolygon(p);
  });
  lge.drawPolygon(player.boundingBox);
  // console.log(player);

  numberAsteroids -= player.handleCollision(asteroids);
  ctx.fillText(`Score: ${player.score}`, 10, 50);

  asteroids.forEach((a: Asteroid) => {
    a.update();
    lge.drawPolygon(a);
    lge.drawPolygon(a.boundingBox);
  });

  pressedKey = null;

  if (
    numberAsteroids < maxNumberAsteroids &&
    Utils.randomInt(10) <= spawnProb
  ) {
    console.log("spawned");
    asteroids.push(asteroidFactory());
    numberAsteroids++;
  }

  setTimeout(loop, renderDelay);
};

// requestAnimationFrame(loop);

// asteroids.push(asteroidFactory());
// asteroids.push(asteroidFactory());
// asteroids.push(asteroidFactory());
// asteroids.push(asteroidFactory());
// asteroids.push(asteroidFactory());
// numberAsteroids = asteroids.length;

// player.translate(canvas.width / 2, canvas.height / 2);

// asteroids.push(new Asteroid({400, 400}))

loop();
