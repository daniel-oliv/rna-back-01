import { MnistRawDatum } from "./idx_ubyte_to_json";

export class Datum{
  id: string|number;
  inVector: number[];
  targetVector: number[];
  classes: string[]
}

export class MnistDatum extends Datum{
  public class: DigitClass;
  constructor(
    public rawVector: MnistRawDatum,id: number
  )
  {
    super();
    this.inVector = rawVector.data
    this.class = <DigitClass>rawVector.label;
    this.id = id;
    this.setTarget(rawVector.label)
    // console.log('this.inVector ', this.inVector);
  }

  private setTarget(target: string){
    this.targetVector = Array(10).fill(-1);
    this.targetVector[target] = 1;
  }
}

export type DigitClass = string

export class IrisDatum extends Datum{
  public class: IrisClass;
  constructor(
    public rawVector: string[],id: number
  )
  {
    super();
    this.inVector = rawVector.slice(0,rawVector.length-1).map(d=>+d)
    this.class = <IrisClass>rawVector[rawVector.length-1];
    this.id = id;
    this.setTarget()
    // console.log('this.inVector ', this.inVector);
  }

  private setTarget(){
    switch (this.class) {
      case 'Iris-setosa':
        this.targetVector = [1, -1, -1]
        break;
      case 'Iris-versicolor':
        this.targetVector = [-1, 1, -1] 
        break;
      case 'Iris-virginica':
        this.targetVector = [-1, -1, 1] 
        break;
      default:
        console.error('INVALID IRIS CLASS')
        break;
    }
  }
}

export type IrisClass = 'Iris-setosa'|'Iris-versicolor'|'Iris-virginica'

export class SonarDatum extends Datum{
  public class: SonarClass;
  constructor(
    public rawVector: string[]
  )
  {
    super();
    this.inVector = rawVector.slice(0,rawVector.length-2).map(d=>+d)
    this.class = <SonarClass>rawVector[rawVector.length-2];
    this.id = rawVector[rawVector.length-1];
    this.targetVector = this.class =='M' ? [1] : [-1]
    // console.log('this.inVector ', this.inVector);
  }
}

export type SonarClass = 'R'|'M'