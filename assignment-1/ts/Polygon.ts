import {Point} from './Point';
import {Utils} from './Utils';
/**
 * Represents a polygon
 */
export class Polygon {
    points   : Point[];
    triangles: Polygon[];

    /**
     * 
     * @param points points that represent the polygon
     */
    constructor(points : Point[]) {
        this.points = points;
        this.triangles = [];
    }

    /**
     * decomposes the polygon into triangles
     * @returns an array of polygons
     */
    decompose() : Polygon[] {

        if (this.points.length === 3) {
            // dont want to create a cycle so create new polygon
            this.triangles.push(new Polygon(this.points));
            return this.triangles;
        }

        // const oldPoints = this.points.slice(0, this.points.length);

        // while (this.points.length >= 3) {
        //     this.triangles.push(new Polygon([this.points[0], 
        //                                      this.points[1 % this.points.length], 
        //                                      this.points[2 % this.points.length]]));
        //     this.points.splice(1 % this.points.length, 1);
        // }

        // this.points = oldPoints.slice(0, oldPoints.length);


        // return this.triangles;
        let tempPoints = this.points.slice(0, this.points.length);

        while (tempPoints.length > 3) {

            for (let i = 0; i < tempPoints.length; i ++) {
                let prev = (i - 1 + tempPoints.length) % tempPoints.length;
                let next = (i + 1) % tempPoints.length;
                let t = [tempPoints[i], tempPoints[prev], tempPoints[next]]
                let noneIn = true;

                for (let j = 0; j < tempPoints.length; j ++) {
                    if (j != i && j != next && Utils.insideTriangle(tempPoints[j], new Polygon(t))) {
                        noneIn = false;
                        break;
                    }
                }

                if (noneIn) {
                    tempPoints.splice(i, 1);
                    this.triangles.push(new Polygon(t));
                    break;
                }
            }
        }

        this.triangles.push(new Polygon(tempPoints));
        return this.triangles;
    }

    /**
     * Translate position by deltaX, deltaY
     * @param deltaX change in x
     * @param deltaY change in y
     * 
     * @returns Polygon
     */
    translate(x : number, y : number) : Polygon {
        this.points.forEach((p : Point) => {
            p.x += x;
            p.y += y;
        })

        return this
    }

    /**
     * Scales all the points by x and y
     * @param x x multiplier
     * @param y y multiplier
     * 
     * @returns Polygon
     */
    scale(x: number, y : number) : Polygon {
        this.points.forEach((p : Point) => {
            p.x = Math.round(p.x * x);
            p.y = Math.round(p.y * y);
        })
        return this
    }
}