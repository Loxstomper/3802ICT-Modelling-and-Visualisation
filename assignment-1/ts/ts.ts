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
// window.addEventListener("keypress", getInput, false);
ctx.font = "30px Arial";

// change this to requestAnimationFrame
let maxNumberAsteroids: number = 4;
let spawnProb: number = 1;
let numberAsteroids: number = 0;

let lastFrameTimeMS = 0;
let delta = 0;

const loop = (timestamp: number) => {
  delta = (timestamp - lastFrameTimeMS) / 1000;
  lastFrameTimeMS = timestamp;

  lge.clear();
  // lge.clearSmart(asteroids, player);

  player.update(pressedKey, delta);

  player.body.forEach((p: Polygon) => {
    lge.drawPolygon(p);
  });
  lge.drawPolygon(player.boundingBox);
  // console.log(player);

  const playerCentrePoly: Polygon = new ShapeFactory().square(
    player.centrePoint.x - 10,
    player.centrePoint.y - 10,
    20,
    20
  );

  playerCentrePoly.fillColour = Colours.black;

  lge.drawPolygon(playerCentrePoly);

  lge.drawLine(
    player.centrePoint,
    {
      x: player.centrePoint.x + 50 * Math.cos(player.angle),
      y: player.centrePoint.y + 50 * Math.sin(player.angle)
    },
    Colours.green
  );

  numberAsteroids -= player.handleCollision(asteroids);
  ctx.fillText(`Score: ${player.score}`, 10, 50);

  asteroids.forEach((a: Asteroid) => {
    a.update(delta);
    lge.drawPolygon(a);
    lge.drawPolygon(a.boundingBox);
  });

  // lge.drawPolygonBuffer([...player.body, ...asteroids]);

  pressedKey = null;

  if (
    numberAsteroids < maxNumberAsteroids &&
    Utils.randomInt(10) <= spawnProb
  ) {
    console.log("spawned");
    asteroids.push(asteroidFactory());
    asteroids[numberAsteroids].fillColour = Colours.blue;
    numberAsteroids++;
  }

  requestAnimationFrame(loop);
};

// requestAnimationFrame(loop);

// loop();

const square = new ShapeFactory().square(350, 350, 100, 100, true);
square.colour = Colours.red;
square.fillColour = Colours.white;

const staticSquare = new ShapeFactory().square(350, 100, 100, 100, true);
staticSquare.colour = Colours.red;
staticSquare.fillColour = Colours.white;

const rotationSpeed = 180;
let velocity = 5;

const wtfRotateLoop = (timestamp: any) => {
  lge.clear();

  delta = (timestamp - lastFrameTimeMS) / 1000;
  lastFrameTimeMS = timestamp;

  lge.drawLine({ x: 0, y: 350 }, { x: 800, y: 350 }, Colours.red);
  lge.drawLine({ x: 0, y: 450 }, { x: 800, y: 450 }, Colours.red);
  lge.drawLine({ x: 350, y: 0 }, { x: 350, y: 800 }, Colours.red);
  lge.drawLine({ x: 450, y: 0 }, { x: 450, y: 800 }, Colours.red);

  square.rotate(rotationSpeed * delta);
  staticSquare.rotate(rotationSpeed * delta);

  if (square.centrePoint.x <= 200 || square.centrePoint.x >= 600) {
    velocity *= -1;
  }

  square.translate(velocity, 0);

  const squareCentre: Polygon = new ShapeFactory().square(
    square.centrePoint.x - 10,
    square.centrePoint.y - 10,
    20,
    20
  );

  const staticSquareCentre: Polygon = new ShapeFactory().square(
    staticSquare.centrePoint.x - 10,
    staticSquare.centrePoint.y - 10,
    20,
    20
  );

  lge.drawPolygon(square);
  lge.drawPolygon(square.boundingBox);
  lge.drawPolygon(squareCentre);
  lge.drawPolygon(staticSquare);
  lge.drawPolygon(staticSquareCentre);

  requestAnimationFrame(wtfRotateLoop);
};

// requestAnimationFrame(wtfRotateLoop);
requestAnimationFrame(loop);
