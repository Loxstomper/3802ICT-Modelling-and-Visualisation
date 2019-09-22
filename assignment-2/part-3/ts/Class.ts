export class Class {
  public name: string;
  public parent?: string | Class;
  public children?: Class[];
  public properties?: string[];
  public methods?: string[];

  constructor(name: string, parent?: string) {
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
