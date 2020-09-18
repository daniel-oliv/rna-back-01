import { shuffle } from "lodash";
import { parseCSV } from "../utils/fileMan";
import { SonarDataset } from "./dataset-class";
import { SonarDatum } from "./Datum";
import { SigmoidPerceptron, SigmoidPerceptronParams } from "./sigmoid-perceptron/perceptron";

export async function main05(){
  const rawData = shuffle(await parseCSV('./assets/sonar.all-data',false, ','));
  // console.log('rawData ', rawData);

  //!misturar e padronizar
  const dataset = new SonarDataset(rawData)
  const nInputs = dataset.data[0].inVector.length
  const nOutputs = dataset.data[0].targetVector.length;
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
  const params: SigmoidPerceptronParams = {
    type: 'Sigmoid Perceptron',
    nInputs: nInputs, 
    nOutputs: nOutputs, 
    initWeightsMode: {name: 'zeros'},
    learningRate: 0.01,
    // theta: 0.01,
    sigma: 1,
    maxEpoch: 500,
    dwAbsMin: 0.00001,
  }
  const ann = new SigmoidPerceptron(params);

  const ret = await ann.train(dataset.data.concat(),(res)=>console.log(res));
  console.log('ret ', ret);
  // const res = ann.testDataset(dataset.data.slice(167,208));
  // console.log('res ', JSON.stringify(res,null,2))
}