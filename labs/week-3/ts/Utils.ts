import { Point } from "./Point";
import { Polygon } from "./Polygon";

/**
 * Utility Class
 */
export class Utils {

    /**
     * Generates a random number [0...max]
     * @param max max number
     * @returns random number between 0 and max
     */
    static randomInt(max : number) : number {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * Are the points on the same side
     * @param a point
     * @param b point
     * @param l1 line1
     * @param l2 line2
     * 
     * @returns boolean
     */
    static sameSide(a : Point, b : Point, l1 : Point, l2 : Point) : Boolean {
        const apt = (a.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (a.y - l1.y);
        const bpt = (b.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (b.y - l1.y);

        return ((apt * bpt) > 0);
    }

    /**
     * Is a point in a triangle
     * @param p point
     * @param t triangle
     * 
     * @returns boolean
     */
    static insideTriangle(p : Point, t : Polygon) : Boolean {
        const [a, b, c] = t.points;

        return this.sameSide(p, a, b, c) && this.sameSide(p, b, a, c) && this.sameSide(p, c, a, b);
    }
}