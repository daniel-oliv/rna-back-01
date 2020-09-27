import { parseCSV } from "../utils/fileMan";
import { IrisDataset } from "./datasets/iris-dataset";
import { IrisDatum } from "./datasets/Datum";
import { TLP, TLP_Params } from "./two-layer-perceptron/perceptron";
import { SonarDataset } from "./datasets/sonar-dataset";

export async function currentMain(){
  const rawData = await parseCSV('./assets/bezdekIris.data',false, ',');
  // //!misturar e padronizar
  const dataset = new IrisDataset('iris', rawData)
  
  // const rawData = await parseCSV('./assets/sonar.all-data',false, ',');
  //!misturar e padronizar
  // const dataset = new SonarDataset('sonar', rawData)
  
  dataset.randomlySort();
  const setLen = dataset.data.length;
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
  const params: TLP_Params = {
    type: 'Two Layer Perceptron',
    nInputs: nInputs, 
    nOutputs: nOutputs, 
    initWeightsMode: {name: 'random',wLimit: 0.1},
    learningRate: 0.1,
    outSigma: 0.9,
    hiddenSigma: 0.9,
    numHiddenNeurons: 3,
    maxEpoch: 100,
    dwAbsMin: 0.00001,
    setsLength: {train: Math.floor(0.80*setLen), 
      test: Math.floor(0.20*setLen), 
      validation: Math.floor(0.20*setLen)
    }
  }
  //! CHUTO QUE VAMOS precisar idealmente de dois neurônios na camada de escondida, e não de três
  const ann = new TLP(params);

  // const ret = await ann.train(dataset.data.slice(0,100),(res)=>console.log(res));
  // console.log('ret ', ret);
  // const res = ann.testDataset(dataset.data.slice(100,150));
  // const res = await ann.trainAndTest(dataset.data, params.setsLength, (res)=>console.log('res ', res));
  const res = await ann.trainCrossValidation(dataset.data, params.setsLength, (res)=>console.log('res ', res));
  console.log('res trainAndTest', res)
}