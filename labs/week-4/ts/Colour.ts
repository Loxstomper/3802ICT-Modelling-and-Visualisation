

/**
 *  Represents a colour (r, g, b, a)
 */
export class Colour {
    r : number;
    g : number;
    b : number;
    a : number;

    /**
     * 
     * @param r red (0-255)
     * @param g green (0-255)
     * @param b blue (0 - 255)
     * @param a alpha (0 - 100)
     * 
     */
    constructor(r : number, g : number, b : number, a : number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * string representation
     * @returns returns string format 'rgba(r, g, b, a)'
     */
    toString() : string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

}

export let Colours = {
    red  : new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue : new Colour(0, 0, 255, 100),
    black: new Colour(0, 0, 0, 100),
    white: new Colour(255, 255, 255, 100)
}