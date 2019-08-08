/**
 * Matrix Class
 */
export class Matrix {
    values : number[][];
    width : number;
    height : number;

    identityMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];

    constructor(values : number[][] | null) {
        if (values === null) {
            this.values = JSON.parse(JSON.stringify(this.identityMatrix));
        } else {
            this.values = values;
        }
        this.width  = this.values[0].length;
        this.height = this.values.length; 
    }

    add(b : Matrix) : Matrix {
        if (this.width !== b.width && this.height !== b.height) {
            throw new Error('Dimension miss match');
        }

        let out : Matrix = new Matrix(null);
        out.zero();

        for (let i = 0; i < this.height; i ++) {
            for (let j = 0; j  < this.width; j ++) {
                out.values[i][j] = this.values[i][j] + b.values[i][j];
            }
        }

        return out;
    }

    multiply(b : Matrix) : Matrix {
        // if (this.width != b.height || this.height != b.width) {
        //     throw new Error('Dimension miss match');
        // }

        let res : number[] = [0, 0, 0];

        // for (let i = 0; i < this.values.length; i ++) {
        //     for (let j = 0; j < this.values[i].length; j ++) {
        //         res[i] += this.values[i][j] * b.values[j][0];
        //     }
        // }

        let x = JSON.stringify(this.values);
        let y = JSON.stringify(b.values);
        let z = JSON.stringify(res);

        console.log('This:');
        console.log(JSON.parse(x));
        console.log('B: ');
        console.log(JSON.parse(y));

        res[0] = this.values[0][0] * b.values[0][0] + this.values[0][1] * b.values[1][0] + this.values[0][2] * b.values[2][0];
        res[1] = this.values[1][0] * b.values[0][0] + this.values[1][1] * b.values[1][0] + this.values[0][2] * b.values[2][0];
        res[2] = this.values[2][0] * b.values[0][0] + this.values[2][1] * b.values[1][0] + this.values[0][2] * b.values[2][0];

        console.log('RES: ');
        console.log(res);


        return new Matrix([[res[0]], [res[1]], [res[2]]]);
    }

    zero() {
        for (let i = 0; i < this.height; i ++) {
            for (let j = 0; j < this.width; j ++) {
                this.values[i][j] = 0;
            }
        }
    }



};
