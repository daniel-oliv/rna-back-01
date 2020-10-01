import { parseCSV } from "../utils/fileMan";
import { getTrainTestData } from "./datasets/idx_ubyte_to_json";
import { IrisDataset } from "./datasets/iris-dataset";
import { MnistDataset } from "./datasets/mnist";
import { TLP, TLP_Params } from "./two-layer-perceptron/perceptron";

export async function currentMain(){
  const rawData = getTrainTestData();
  const trainSet = new MnistDataset('mnist', rawData.trainData.slice(0,10000))
  const testSet = new MnistDataset('mnist', rawData.testData)
    
  trainSet.randomlySort();

  const setLen = trainSet.data.length + testSet.data.length;
  const nInputs = trainSet.data[0].inVector.length
  const nOutputs = trainSet.data[0].targetVector.length;
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
    learningRate: 0.4,
    outSigma: 0.9,
    hiddenSigma: 0.9,
    numHiddenNeurons: 15,
    maxEpoch: 100,
    dwAbsMin: 0.00001,
    setsLength: {train: Math.floor(0.80*trainSet.data.length), 
      test: testSet.data.length, 
      validation: Math.floor(0.20*trainSet.data.length)
    }
  }
  //! CHUTO QUE VAMOS precisar idealmente de dois neurônios na camada de escondida, e não de três
  const ann = new TLP(params);

  // const ret = await ann.train(dataset.data.slice(0,100),(res)=>console.log(res));
  // console.log('ret ', ret);
  // const res = ann.testDataset(dataset.data.slice(100,150));
  const res = await ann.trainAndTest(trainSet.data.concat(testSet.data), params.setsLength, (res)=>console.log('res ', res));
  // const res = await ann.trainCrossValidation(trainSet.data.concat(testSet.data), params.setsLength, (res)=>console.log('res ', res));
  console.log('res trainAndTest', res)
}