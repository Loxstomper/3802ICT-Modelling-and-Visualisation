import { Colour } from "./Colour";
import { Matrix } from "./Matrix";

export class Drawable {
  public translationMatrix: Matrix;
  public rotationMatrix: Matrix;
  public transformationMatrix: Matrix;
  public scale: number;
  public angle: number;
  public colour: Colour;
  public fillColour: Colour;

  constructor() {
    this.scale = 1;
    this.angle = 0;
  }
}
