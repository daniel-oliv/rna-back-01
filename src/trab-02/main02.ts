import { ANN } from "./ann";
import { DigitDatum } from "./Datum";

export async function main02(){
  const data = [
    new DigitDatum(
    [
      [1,   1,  1],
      [1,   1,  1],
      [1,  -1,  1],
      [1,  -1,  1],
      [1,  -1,  1],
      [1,   1,  1],
      [1,   1,  1],
   ], 
   [1,-1,-1,-1,-1,-1,-1,-1,-1,-1])
  ]
  const nInputs = data[0].inVector.length
  const nOutput = data[0].targetVector.length;
  const ann = new ANN(nInputs, nOutput);

  ann.train(data);
  const res = ann.testDataset(data);
  console.log('res ', res)
}