
export class Datum{
  id: string|number;
  inVector: number[];
  targetVector: number[];
}

export class DigitDatum extends Datum{
  constructor(
    public inMatrix: number[][],
    public targetVector: number[]
  )
  {
    super();
    this.inVector = inMatrix.reduce((pre,cur)=>{return pre.concat(cur)},[])
    // console.log('this.inVector ', this.inVector);
  }
}

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