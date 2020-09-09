import { Adaline, AdalineParams } from "./adaline/adaline";
import { DigitDatum } from "./Datum";
import { Perceptron } from "./perceptron.ts/perceptron";

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
  //   type: 'adaline',
  //   nInputs: nInputs, 
  //   nOutputs: nOutputs, 
  //   initWeightsMode: {name: 'random',params: {initWLimit: 0.1}},
  //   learningRate: 0.01,
  //   theta: 0,
  //   maxEpoch: 100,
  //   dwAbsMin: 0.01,
  // }
  const params: AdalineParams = {
    type: 'adaline',
    nInputs: nInputs, 
    nOutputs: nOutputs, 
    initWeightsMode: {name: 'zeros',params: {initWLimit: 0.1}},
    learningRate: 0.001,
    theta: 0.01,
    maxEpoch: 100,
    dwAbsMin: 0.0001,
  }
  const ann = new Perceptron(params);

  const ret = ann.train(data,(res)=>console.log(res));
  console.log('ret ', ret);
  const res = ann.testDataset(data);
  // console.log('res ', res)
}