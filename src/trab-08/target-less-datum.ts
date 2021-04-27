import { randInRange, randomInt } from "../utils/common";

export class TargetLessDatum{
  id: string|number;
  inVector: number[];
  targetVector?: number[];
  classes?: string[]
}


export function getDumpData(numVectors, vectorLen){
  const ret: TargetLessDatum[]=[];
  let i = 0;
  while(ret.length < numVectors){
    const vec = new Array(vectorLen).fill(0).map(d=>randInRange(0.5,-0.5))
    if(vec[0]**2+vec[1]**2<0.25) ret.push({
      id: ret.length-1,
      inVector: vec
    })
  }
  return ret;
}