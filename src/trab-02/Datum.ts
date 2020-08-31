import { extend } from "lodash";

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