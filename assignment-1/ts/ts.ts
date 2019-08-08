import { Asteroid } from "./Asteroid";
import { Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { LGE } from "./LGE";
import { Matrix } from "./Matrix";
import { Polygon } from "./Polygon";
import { ShapeFactory } from "./ShapeFactory";

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

const lge = new LGE(ctx, 1, "scanLine");
const sf: ShapeFactory = new ShapeFactory();

const square: Polygon = sf.square(350, 350, 100, 100);
const a = new Asteroid({ x: 400, y: 400 });

lge.drawPolygon(square, Colours.black);
// square.rotate(45);
// square.translate(100, 100);
square.moveTo(400, 400);
lge.drawPolygon(square, Colours.red);
