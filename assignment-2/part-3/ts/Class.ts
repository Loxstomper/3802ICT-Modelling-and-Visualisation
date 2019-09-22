export class Class {
  public name: string;
  public parent?: number;
  public children?: number[];
  public properties?: string[];
  public methods?: string[];
  public width: number;
  public height: number;

  constructor(name: string, parent?: number) {
    this.name = name;
    this.parent = parent;
  }

  public getWidth(): number {
    return 1;
  }

  public getHeight(): number {
    return 1;
  }
}
