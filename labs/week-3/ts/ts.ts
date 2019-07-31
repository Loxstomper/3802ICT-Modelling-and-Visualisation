import {Colours} from './Colour';
import {Point} from './Point';
import {ShapeFactory} from './ShapeFactory';
import {Polygon} from './Polygon';
import {LGE} from './LGE';



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
lge.fillPolygon(square, Colours.white);
lge.scanLineFill(square.translate(-110, 0), Colours.white);
lge.drawPolygon(square.translate(-110, 0), Colours.white);

// lge.drawCircle(300, 300, 50, 4, Colours.red);

let triangle : Point[] = [new Point(450, 320), new Point(650, 470), new Point(450, 470)];

lge.fillTriangle(triangle, Colours.blue);
lge.scanLineFill((new Polygon(triangle)).translate(-210, 0), Colours.blue);
lge.drawPolygon((new Polygon(triangle)).translate(-210, 0), Colours.blue);



let convexPolygon : Polygon = new Polygon([new Point(450, 600),
          new Point(750, 700),
          new Point(750, 750),
          new Point(600, 750)]);

lge.fillPolygon(convexPolygon, Colours.black);
lge.scanLineFill(convexPolygon.translate(-210, 0), Colours.black);
lge.drawPolygon(convexPolygon.translate(-210, 0), Colours.black);

let concavePolygon : Polygon = new Polygon([new Point(150, 150),
                                            new Point(200, 100),
                                            new Point(200, 200),
                                            new Point(100, 200), 
                                            new Point(100, 100)]);

concavePolygon.translate(200, 0);
lge.fillPolygon(concavePolygon, Colours.black);
lge.scanLineFill(concavePolygon.translate(-110, 0), Colours.black);
lge.drawPolygon(concavePolygon.translate(-110, 0), Colours.black);

let octogon : Polygon = new Polygon([new Point(700, 50),
                                     new Point(750, 50),
                                     new Point(775, 75),
                                     new Point(775, 100),
                                     new Point(750, 125),
                                     new Point(700, 125),
                                     new Point(675, 100),
                                     new Point(675, 75)]);

lge.fillPolygon(octogon, Colours.green);
lge.scanLineFill(octogon.translate(-120, 0), Colours.green);
lge.drawPolygon(octogon.translate(-120, 0), Colours.green);


let boundingBox : Polygon = sf.square(400, 400, 400, 250);
const randomDraw = () => {
    // lge.fillPolygon(boundingBox, Colours.white);

    let randomPolygon : Polygon = sf.polygon(400, 400, 400, 250, 5);
    lge.fillPolygon(randomPolygon, Colours.green);
    lge.scanLineFill(randomPolygon.translate(-200, 0), Colours.white)
    lge.drawPolygon(randomPolygon.translate(-200, 0), Colours.black);


    // setTimeout(randomDraw, 100);
}

// randomDraw();





