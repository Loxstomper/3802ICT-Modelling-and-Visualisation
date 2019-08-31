/**
 * The Matrix class is used for matrix operations most commonly for translating and rotating polygons
 * which is performed using transformation matrices.
 */
export class Matrix {
  public values: number[][];
  public width: number;
  public height: number;

  public identityMatrix: number[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

  constructor(values: number[][] | null) {
    if (values === null) {
      this.values = JSON.parse(JSON.stringify(this.identityMatrix));
    } else {
      this.values = values;
    }
    this.width = this.values[0].length;
    this.height = this.values.length;
  }

  public add(b: Matrix): Matrix {
    if (this.width !== b.width && this.height !== b.height) {
      throw new Error("Dimension miss match");
    }

    const out: Matrix = new Matrix(null);
    out.zero();

    for (let i: number = 0; i < this.height; i++) {
      for (let j: number = 0; j < this.width; j++) {
        out.values[i][j] = this.values[i][j] + b.values[i][j];
      }
    }

    return out;
  }

  public multiply(b: Matrix): Matrix {
    // if (this.width != b.height || this.height != b.width) {
    //     throw new Error('Dimension miss match');
    // }

    const res: number[] = [0, 0, 0];

    res[0] =
      this.values[0][0] * b.values[0][0] +
      this.values[0][1] * b.values[1][0] +
      this.values[0][2] * b.values[2][0];
    res[1] =
      this.values[1][0] * b.values[0][0] +
      this.values[1][1] * b.values[1][0] +
      this.values[1][2] * b.values[2][0];
    res[2] =
      this.values[2][0] * b.values[0][0] +
      this.values[2][1] * b.values[1][0] +
      this.values[2][2] * b.values[2][0];

    return new Matrix([[res[0]], [res[1]], [res[2]]]);
  }

  public zero(): void {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.values[i][j] = 0;
      }
    }
  }
}
