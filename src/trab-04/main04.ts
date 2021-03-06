import { Adaline, AdalineParams } from "./adaline/adaline";
import { DigitDatum } from "./Datum";
import { Perceptron } from "./perceptron/perceptron";

export async function main04(){

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
  const nOutputs = data[0].targetVector.length;
  // const params: AdalineParams = {
  //   type: 'Adaline',
  //   nInputs: nInputs, 
  //   nOutputs: nOutputs, 
  //   initWeightsMode: {name: 'random',wLimit: 0.1},
  //   learningRate: 0.01,
  //   theta: 0,
  //   maxEpoch: 100,
  //   dwAbsMin: 0.01,
  // }
  const params: AdalineParams = {
    type: 'Adaline',
    nInputs: nInputs, 
    nOutputs: nOutputs, 
    initWeightsMode: {name: 'zeros'},
    learningRate: 0.001,
    theta: 0.01,
    maxEpoch: 100,
    dwAbsMin: 0.0001,
  }
  const ann = new Perceptron(params);

  const ret = await ann.train(data,(res)=>console.log(res));
  console.log('ret ', ret);
  const res = ann.testDataset(data);
  // console.log('res ', res)
}