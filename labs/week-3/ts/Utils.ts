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
}