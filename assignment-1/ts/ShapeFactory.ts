import {Point} from './Point';
import {Polygon} from './Polygon';
import {Utils} from './Utils';
/**
 * Factory to that returns shapes
 */
export class ShapeFactory {
    constructor() {

    }

    /**
     * Creates a square polygon
     * 
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * 
     * @returns Polygon
     */
    square(x : number, y : number, width : number, height : number) : Polygon {
        let points : Point[] = [];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x + width, y + height));
        points.push(new Point(x, y + height));

        return new Polygon(points);
    }

    /**
     * Creates a polygon with n points 
     * 
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param nPoints number of points
     * 
     * @returns Polygon
     */
    polygon(x : number, y : number, width : number, height : number, nPoints : number) {
        let points : Point[] = [];

        for (let i = 0; i < nPoints; i ++) {
            points.push(new Point(x + Utils.randomInt(width), y + Utils.randomInt(height)));
        }

        return new Polygon(points);
    }
}