import {Point} from './Point';
import {Colour, Colours} from './Colour';
import {Polygon} from './Polygon';
import {Pixel} from './Pixel';
import {Utils} from './Utils';

/**
 * Lochie Graphics Engine
 */
export class LGE {
    ctx : CanvasRenderingContext2D;
    resolution : any;
    PIXEL_SIZE : number;
    fillMethod : string | null;

    /**
     * 
     * @param ctx canvas ctx
     * @param PIXEL_SIZE size of each pixel
     * @param fillMethod 'scanLine'/null/'other'
     */
    constructor(ctx : CanvasRenderingContext2D, PIXEL_SIZE: number, fillMethod : string | null) {
        this.ctx = ctx;
        this.PIXEL_SIZE = PIXEL_SIZE;
        this.fillMethod = fillMethod;

        let canvas : any = ctx.canvas;

        this.resolution = {x : canvas.width, y : canvas.height };

    }

    /**
     * scale points
     * @remarks doesn't actual scale due to issues
     * 
     * @param points points to be scaled
     * @returns Point[]
     */
    scalePoints(points: Point[]) : Point[] {

        return points;

        // points.forEach( (p : Point) => {
        //     p.x = Math.floor(p.x) * this.PIXEL_SIZE;
        //     p.y = Math.floor(p.y) * this.PIXEL_SIZE;
        // })

        // return points;
    }

    /**
     * Draws a coloured line between two points
     * @param start first point
     * @param end end point
     * @param colour Colour
     */
    drawLine(start : Point, end : Point, colour : Colour) : void {
        let p0 : Point;
        let p1 : Point;

        [p0, p1] = this.scalePoints([start, end]);

        // const dx = p1.x - p0.x,
        //       dy = p1.y - p0.y,
        //       s  = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) / this.PIXEL_SIZE : Math.abs(dy) / this.PIXEL_SIZE,
        //       xi = dx * 1.0 / s,
        //       yi = dy * 1.0 / s
     
        // let x = p0.x,
        //     y = p0.y,
        //     out = []
     
        // out.push({x: x, y: y});
     
        // for (let i = 0; i < s; i++) {
        //     x += xi;
        //     y += yi;
        //     out.push({x: x, y: y});
        // }
    
        // // out.map(pos => new Pixel(Math.floor(pos.x), Math.floor(pos.y), this.PIXEL_SIZE, this.ctx, colour));
        // out.map(pos => new Pixel(pos.x, pos.y, this.PIXEL_SIZE, this.ctx, colour));


        const dx = Math.ceil(p1.x - p0.x),
              dy = Math.ceil(p1.y - p0.y),
              steps  = Math.abs(dx) > Math.abs(dy) ? Math.ceil(Math.abs(dx) / this.PIXEL_SIZE) 
                                                   : Math.ceil(Math.abs(dy) / this.PIXEL_SIZE);

        if (steps === 0) {
            new Pixel(p0.x, p0.y, this.PIXEL_SIZE, this.ctx, colour);
            return;
        }

        const xInc = dx / steps;
        const yInc = dy / steps;

        let x = p0.x;
        let y = p0.y;

        for (let i = 0; i < steps; i ++) {
            new Pixel(x, y, this.PIXEL_SIZE, this.ctx, colour);
            x += xInc;
            y += yInc;
        }




    }

    /**
     * Draws lines between the points
     * @param points Point[]
     * @param colour Colour
     */
    drawPath(points : Point[], colour : Colour) : void {
        for (let i = 0; i < points.length; i ++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    }

    /**
     * Fills a polygon with the given colour
     * @param poly Polygon
     * @param colour Colour
     */
    scanLineFill(poly : Polygon, colour : Colour) : void {

        let points : Point[] = poly.points;

        const minY = points.reduce( (prev, curr) => prev.y < curr.y ? prev : curr).y;
        const maxY = points.reduce( (prev, curr) => prev.y > curr.y ? prev : curr).y;

        let start = points[points.length - 1]
        let edges = []

        for (let i = 0; i < points.length; i ++) {
            edges.push({0: start, 1: points[i]});
            start = points[i];
        }


        for (let y = minY; y < maxY; y += this.PIXEL_SIZE) {
            let Xs = []

            let x, x1, x2, y1, y2, deltaX, deltaY;

            for (let i = 0; i < edges.length; i ++) {
                x1 = edges[i][0].x
                x2 = edges[i][1].x

                y1 = edges[i][0].y
                y2 = edges[i][1].y

                deltaX = x2 - x1;
                deltaY = y2 - y1;

                x = x1 + (deltaX / deltaY) * (y - y1);

                // x = Math.round(x1 * deltaX / deltaY * (y - y1));

                if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
                    Xs.push(x);
                }
                
            }

            Xs.sort();

            for (let xi = 0; xi < Xs.length - 1; xi += 2) {
                // let left  = Xs[xi]     % 1 == 0 ? Xs[xi] : Math.ceil(Xs[xi]);
                // let right = Xs[xi + 1] % 1 == 0 ? Xs[xi + 1] : Math.floor(Xs[xi + 1]);

                let left  = Xs[xi];
                let right = Xs[xi + 1];

                // console.log("BEFORE: ", left, right);

                // left  = Xs[xi]     % 1 === 0 ? Xs[xi]     : Math.ceil(Xs[xi]);
                // right = Xs[xi + 1] % 1 === 0 ? Xs[xi + 1] : Math.floor(Xs[xi]);

                // console.log("AFTER : ", left, right);

                this.drawLine(new Point(left, y), new Point(right, y), colour);
            }
        }

        // this.drawPolygon(poly, colour);
    }

    /**
     * Other algorithm to fill a polygon
     * @param poly Polygon
     * @param colour Colour
     */
    otherFill(poly : Polygon, colour : Colour) : void {

    }

    /**
     * Fills a polygon based on the method decided on at initialization
     * @param poly Polygon
     * @param colour Colour
     */
    fillPolygon(poly : Polygon, colour : Colour) : void {
        if (this.fillMethod === null || this.fillMethod === 'scanLine') {

            // dont decompose if the polygon is a triangle
            let triangles : Polygon[] = poly.points.length === 3 ? [poly] : poly.decompose();

            triangles.forEach((t : Polygon) => {
                this.scanLineFill(t, colour);
                this.drawPolygon(t, Colours.red);
            });

        } else {
            // this.otherFill(poly, colour);
        }
    }

    /**
     * Draws the polygon
     * @param poly Polygon
     * @param colour Colour
     */
    drawPolygon(poly : Polygon, colour : Colour) : void {
        let points = poly.points;

        for (let i = 0; i < points.length - 1; i ++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    
        this.drawLine(points[points.length - 1], points[0], colour);
    }

    /**
     * Draws a triangle from 3 points
     * @param points Points
     * @param colour Colour
     */
    drawTriangle(points : Point[], colour : Colour) : void {
        this.drawPolygon(new Polygon(points), colour);
    }

    /**
     * Fills a triangle from 3 points
     * @param points Point[]
     * @param colour Colour
     */
    fillTriangle(points : Point[], colour : Colour) : void {
        this.fillPolygon(new Polygon(points), colour);
    }

    /**
     * Draws a rectangle
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param colour Colour
     */
    drawRectangle(x : number, y : number, width : number, height : number, colour : Colour) : void {
        let points : Point[];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));

        this.drawPolygon(new Polygon(points), colour);
    }

    /**
     * Fills a rectangle 
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param colour Colour
     */
    fillRectangle(x : number, y : number, width : number, height : number, colour : Colour) : void {
        let points : Point[];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));

        this.fillPolygon(new Polygon(points), colour);
    }

    /**
     * Draws a circle
     * 
     * @remarks doesnt work
     * 
     * @param xc x pos (centre)
     * @param yc y pos (centre)
     * @param radius radius
     * @param samples number of samples
     * @param colour Colour
     */
    drawCircle(xc : number, yc : number, radius : number, samples : number, colour : Colour) : void {
        let points : Point[] = [];
        let step : number = 1 / radius;

        for (let i = 1; i < samples; i ++) {
            let x = xc + radius * Math.cos(i * step);
            let y = yc + radius * Math.sin(i * step);

            points.push(new Point(x, y));
            points.push(new Point(x, -y));
            points.push(new Point(y, -x));
            points.push(new Point(-y, -x));
            points.push(new Point(-x, -y));
            points.push(new Point(-x, y));
            points.push(new Point(-y, x));
            points.push(new Point(y, x));
        }

        // console.log(points);


        this.drawPolygon(new Polygon(points), colour);
    }

    /**
     * Fills a circle
     * 
     * @remarks doesnt work
     * 
     * @param xc x pos (centre)
     * @param yc y pos (centre)
     * @param radius radius
     * @param samples number of samples
     * @param colour Colour
     */
    fillCircle(x : number, y : number, radius : number, samples : number, colour : Colour) : void {
        let points : Point[];

        for (let i = 1; i < samples; i ++) {
            let p = new Point(radius * (Math.cos((2 * Math.PI) / i)), 
                              radius * (Math.sin((2 * Math.PI) / i)));
            points.push(p);
        }


        this.drawPolygon(new Polygon(points), colour);
    }

    /**
     * Clears the canvas
     */
    clear() : void {
        this.ctx.clearRect(0, 0, this.resolution.x, this.resolution.y);
    }

}